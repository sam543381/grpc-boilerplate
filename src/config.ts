import { ServerCredentials } from "grpc";

const config = {

    servers: {
        'default': {
            address: 'localhost:50051',
            credentials: undefined // => security disabled
        }
    },

    services: {
        'test.Example': {
            definition: 'proto/example.proto',
            remote: {
                address: 'localhost:50051',
                credentials: undefined // => security disabled
            }
        }
    },

}

export default config
