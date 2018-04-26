import ExampleService from "./ExampleService";
import { createFromConfig } from "./core/Server";
import provideClient from "./core/Client";
import { log } from "./core/logger";

/*
 * This example creates a simple gRPC server (see 'ExampleService.ts') compliant
 * with the ProtoculBuffers definition (see 'definition.proto').
 * Along with a client that trigger a simple RPC call ('sendMessage')
 * And a more complex bidirectional streaming RPC call ('sendMultipleMessages')
*/

let example = new ExampleService()
let server = createFromConfig('default')

server.addService(example)
server.start()

let client = provideClient({
    name: 'Example',
    package: 'test'
})

log('\nStarting client calls:')

client.sendMessage({
    name: 'Jack'
}, (err, res) => log(res.payload))

let call = client.sendMultipleMessages()

call.write({ name: 'Simon' })
call.on('data', res => log(res.payload))

call.end()
