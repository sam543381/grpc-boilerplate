
import { ServerCredentials, Server as S } from "grpc";
import { fatal, error, log } from "./logger";
import Service from "./Service";
import proto, { get } from "./proto";
import config from "../config";

export function createFromConfig(): Server {

    let address = config.proto.address
    let credentials = config.proto['credentials']

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
                        res.then(r => callback(null, res))
                    else
                        callback(null, res)

                } else {
                    // Stream RPC

                    fn(call)
                }
            }
        }

        services.forEach(service => {

            let definition = get(service).service
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
