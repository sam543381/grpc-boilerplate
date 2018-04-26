import Service, { inferServiceConnectionInfos } from "./Service";
import config from "../config";
import { credentials as c, ServerCredentials } from 'grpc'
import { getDefinition } from "./proto";

export default function provideClient(service: Service, address: string = undefined, credentials: ServerCredentials = undefined) {

    if (address === undefined) {
        let infered = inferServiceConnectionInfos(service)
        address = infered.address
        credentials = infered.credentials
    }

    if (credentials === undefined)
        credentials = c.createInsecure()

    let constructor = getDefinition(service)
    return new constructor(address, credentials)

}
