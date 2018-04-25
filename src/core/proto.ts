
import { load } from 'grpc'
import { fatal } from './logger'
import config from '../config'
import { resolve } from 'path'
import Service from './Service';

let proto
try {
    let path = resolve(config.proto.path)
    proto = load(path)
} catch (e) {
    fatal(e)
}


export default proto

export function get(service: Service) {
    return service.package && service.package !== null ?
        proto[service.package][service.name]
        : proto[service.name]
}
