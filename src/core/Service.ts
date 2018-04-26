import config from "../config";

export default interface Service {

    name: string
    package: string

}

export function getServiceIdentifier(service: Service) {

    return service.package ? `${service.package}.${service.name}` : service.name

}

export function inferServiceConnectionInfos(service: Service) {

    let id = getServiceIdentifier(service)
    let conf = config.services[id]
    if (!conf) throw new Error(`Service with identifier ${id} is not configured.`)
    if (!conf.remote) throw new Error(`No remote service with identifier ${id}. Configured services are ${Object.keys(config.services).join(',')}`)

    return conf.remote
}
