# grpc-boilerplate
Typescript gRPC microservices made easy, quick and maintainable

# Features
- Promise (or async functions) support
- Services simply defined with a class
- Easy client & server creation
- Configuration can be infered programmatically or via config.ts
- Client to server RPC stream support
- Server to client RPC stream support
- Bidirectional RPC stream support

# Installation
```bash
git clone https://github.com/sam543381/grpc-boilerplate.git grpc-boilerplate
cd grpc-boilerplate
```
Take a look at the example, and when ready to start programming:
```
# Resets examples and initializes a new git repository
chmod +x reset.bash
./reset.bash
```

# Usage

## Create the service definition (Protocol Buffers v3 syntax)
```protobuf
syntax = "proto3";

package test;

message Request {
    string name = 1;
}

message Response {
    string payload = 1;
}

service Example {

    rpc sendMessage (Request) returns (Response) {}
    rpc sendMultipleMessages(stream Request) returns (stream Response) {}

}
```

## Create the server implementation
```typescript
import Service from "./core/Service";

export default class ExampleService implements Service {

    name = 'Example'
    package = 'test'

    sendMessage(call) {
        return { payload: `Hi ${call.request.name}` }
    }

    sendMultipleMessages(call) {

        let name
        
        call.on('data', req => {
            name = req.name
            call.write({ payload: `Hi ${name}`})

            call.write({ payload: `Some message for ${name}`})
            call.write({ payload: `Another message for ${name}`})
            call.write({ payload: `Yet another (last) message for ${name}`})
        })

        call.on('end', () =>
            call.write( { payload: `Bye ${name}`} ))

    }

}
```

## Create and start a server
```typescript

let example = new ExampleService()
let server = createFromConfig()

server.addService(example)
server.start()
```

## Create a client and make RPC calls
```typescript
import provideClient from "./core/Client";

let client = provideClient({
    name: 'Example',
    package: 'test'
})

// Simple RPC call
client.sendMessage({
    name: 'Jack'
}, (err, res) => log(res.payload))

// RPC Stream
let call = client.sendMultipleMessages()
call.write({ name: 'Simon' })
call.on('data', res => log(res.payload))
call.end()
```

# Promise example
```typescript
import Service from './core/Service'

export default class UserService implements Service {

    package = 'test'
    name = 'Test'

    async findUserByName(call) {

        let { username } = call.request

        let user = await db.someBlockingSearchMethod(username)

        return user

    }

}
```
