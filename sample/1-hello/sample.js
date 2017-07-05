(async () => {

    /*
    **  ==== SERVER ====
    */

    const { Server } = require("graphql-io-server")
    const server = new Server({ url: "http://127.0.0.1:12345/api" })
    server.at("graphql-resolver", () => ({
        Root: { hello: [ "hello: String", () => "world" ] }
    }))
    await server.start()

    /*
    **  ==== CLIENT ====
    */

    const { Client } = require("graphql-io-client")
    const client = new Client({ url: "http://127.0.0.1:12345/api" })
    await client.connect()
    let result = await client.query("{ hello }")
    await client.disconnect()
    console.log(result.data)

    await server.stop()

})().catch((err) => {
    console.log("ERROR", err)
})
