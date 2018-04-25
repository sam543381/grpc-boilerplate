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
