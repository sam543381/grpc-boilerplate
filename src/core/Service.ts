import proto from "./proto";

export default interface Service {

    name: string
    package: string

}

export function getServiceIdentifier(service: Service) {

    return service.package ? `${service.package}.${service.name}` : service.name

}

export function inferServiceConnectionInfos(service: Service) {

    return proto.addresses[getServiceIdentifier(service)]

}
