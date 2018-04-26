
import { ServerCredentials, Server as S } from "grpc";
import { fatal, error, log } from "./logger";
import Service from "./Service";
import config from "../config";
import { getDefinition } from "./proto";

export function createFromConfig(name: string): Server {

    let conf = config.servers[name]

    if (!conf) throw new Error(`No server with name ${name} in config. Avaible servers arer ${Object.keys(config.servers).join(',')}`)

    let address = conf.address
    let credentials = conf.credentials

    return new Server(address, credentials)

}

export default class Server {

    server: S

    constructor(private address: string, private credentials: ServerCredentials, private services: Array<Service> = [], private opts = {}) {
        this.server = new S(opts)

        if (credentials === undefined)
            this.credentials = ServerCredentials.createInsecure()
    }

    addService(service: Service) {
        this.services.push(service)
    }

    private init(services: Array<Service>) {

        function adapt(fn) {
            return function(call, callback) {

                if (callback) {
                    // Simple RPC

                    let res
                    try {
                        res = fn(call)
                    } catch (e) {
                        callback(e, null)
                    }

                    if (res instanceof Promise)
                        res.then(r => callback(null, r))
                    else
                        callback(null, res)

                } else {
                    // Stream RPC

                    fn(call)
                }
            }
        }

        services.forEach(service => {

            let definition = getDefinition(service).service
            let rpcs = Object.keys(definition)

            let serviceConfig = {}
            rpcs.forEach(name => serviceConfig[name] = adapt(service[name]))

            this.server.addService(definition, serviceConfig)
        })

    }

    start() {

        try {
            this.init(this.services)
        } catch (e) {
            error('Unable to initialize services')
            fatal(e)
        }

        try {
            this.server.bind(this.address, this.credentials)
            this.server.start()
        } catch (e) {
            error('Unable to start the server')
            fatal(e)
        }

        log(`Server started (${this.address})`)
    }

}
