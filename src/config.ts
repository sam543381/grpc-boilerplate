import { ServerCredentials } from "grpc";

const config = {

    proto: {
        path: 'definition.proto',
        address: 'localhost:50051'
    },

    addresses: {
        'test.Example': {
            address: 'localhost:50051',
            credentials: undefined // => security disabled
        }
    }

}

export default config
