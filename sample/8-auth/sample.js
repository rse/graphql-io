(async () => {

    /*
    **  ==== SERVER ====
    */

    const { Server } = require("graphql-io-server")
    const server = new Server({ url: "http://127.0.0.1:12345", debug: 9 })
    server.at("debug", (ev) => console.log(`server [${ev.level}] ${ev.msg}`))
	server.at("account-authenticate", (ctx) => {
		// Check username and password
		if(ctx.password !== 'secret1') {
			return (ctx.error = "invalid password")
		}

		// assign accountId
		ctx.accountId = ctx.username
		return ctx
	})
    server.at("graphql-resolver", () => ({
        Root: { hello: [ "hello: String", () => "world" ] }
    }))
    await server.start()

    /*
    **  ==== CLIENT ====
    */

    const { Client } = require("graphql-io-client")
    const client = new Client({ url: "http://127.0.0.1:12345", debug: 9 })
    client.at("debug", (ev) => console.log(`client [${ev.level}] ${ev.msg}`))
	client.at("login-credentials", (credentials) => {
			credentials.username     = "john"
            credentials.password     = "secret1"
            return credentials

	})
    await client.connect()
    await client.login()
    let result = await client.query("{ hello }")
    await client.disconnect()
    console.log(result.data)

    await server.stop()
    console.log("OK")

})().catch((err) => {
    console.log("ERROR", err)
})
