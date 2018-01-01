(async () => {

    /*
    **  ==== SERVER ====
    */

    const { Server } = require("graphql-io-server")
    const server = new Server({ url: "http://127.0.0.1:12345", debug: 9 })
    server.at("debug", (ev) => console.log(`server [${ev.level}] ${ev.msg}`))
    server.at("graphql-resolver", () => ({
        Root: {
            hello1: [ "hello1: String", () => "world" ],
            hello2: [ "hello2: String", () => { throw new Error("problem") } ]
        }
    }))
    await server.start()

    /*
    **  ==== CLIENT ====
    */

    const { Client } = require("graphql-io-client")
    const client = new Client({ url: "http://127.0.0.1:12345", debug: 9 })
    client.at("debug", (ev) => console.log(`client [${ev.level}] ${ev.msg}`))
    client.at("error", (ev) => console.log(`ERROR (directly): ${err}`))
    await client.connect()
    let result = await client.query("{ hello1 }")
    console.log("RESULT", result)
    result = await client.query("{ hello2 }")
    console.log("RESULT", result)
    await client.disconnect()

    await server.stop()
    console.log("OK")
    process.exit(0)
})().catch((err) => {
    console.log("ERROR (outer)", err)
    process.exit(0)
})

