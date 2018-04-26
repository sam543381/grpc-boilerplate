
import { load } from 'grpc'
import { error } from './logger'
import config from '../config'
import { resolve } from 'path'
import Service, { getServiceIdentifier } from './Service';

let definitions = {}

export function getCached(service: Service) {

    let id = getServiceIdentifier(service)
    let def = definitions[id]
    
    return def ? def : null

}

export function cache(service: Service, def) {
    definitions[getServiceIdentifier(service)] = def
}

export function loadProtoFile(path) {
    let p = resolve(path)
    try {
        return load(p)
    } catch (e) {
        error(`Unable to load proto file with path ${path}`)
        throw e
    }
}

export function getProtoPath(service: Service) {
    let id = getServiceIdentifier(service)
    let conf = config.services[id]
    
    if (!conf) throw new Error(`No configured service with id ${id}`)
    return conf.definition
}

export function getDefinition(service: Service) {

    try {

        let cached = getCached(service)
        if (cached !== null)
            return cached
        else {
            let path = getProtoPath(service)
            let def = loadProtoFile(path)
            let o = service.package ? def[service.package][service.name] : def[service.name]

            cache(service, o)
            return o
        }

    } catch (e) {
        error(`An error occured while loading definition of service with id ${getServiceIdentifier(service)}`)
        throw e
    }

}
