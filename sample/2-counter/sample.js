(async () => {

    /*
    **  ==== SERVER ====
    */

    const { Server } = require("graphql-io-server")

    const server = new Server({ url: "http://127.0.0.1:12345/api" })
    server.at("graphql-schema", () => `
        extend type Root {
            counter: Counter
        }
        type Counter {
            value:    Int
            increase: Counter
        }
    `)
    let counter = {
        value: 0
    }
    server.at("graphql-resolver", () => ({
        Root: {
            counter: (obj, args, ctx, info) => {
                ctx.scope.record("Counter", 0, "read", "direct", "one")
                return counter
            }
        },
        Counter: {
            increase: (obj, args, ctx, info) => {
                counter.value++
                ctx.scope.record("Counter", 0, "update", "direct", "one")
                return counter
            }
        }
    }))
    await server.start()

    /*
    **  ==== CLIENT ====
    */

    const { Client } = require("graphql-io-client")

    const client = new Client({ url: "http://127.0.0.1:12345/api" })
    await client.connect()

    let subscription = client.query("subscription { counter { value } }").subscribe((result) => {
        console.log("SUBSCRIPTION", result.data)
    })

    let handler = async () => {
        await client.query("mutation { counter { increase { value } } }")
        let timeout = 1000 * Math.random()
        setTimeout(handler, timeout)
    }
    let timer = setTimeout(handler, 0)

})().catch((err) => {
    console.log("ERROR", err)
})
