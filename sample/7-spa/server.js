(async () => {

    const { Server } = require("graphql-io-server")
    const server = new Server({
        url: "http://0.0.0.0:12345",
        frontend: ".",
        debug: 9
    })
    server.at("debug", (ev) => console.log(`server [${ev.level}] ${ev.msg}`))
    server.at("blob", (ctx) => {
        console.log(ctx.path)
        if (ctx.path === "graphql-io.js")
            ctx.path = require.resolve("graphql-io-client/lib/browser/graphql-io.js")
    })
    server.at("graphql-resolver", () => ({
        Root: { hello: [ "hello: String", () => "world" ] }
    }))
    await server.start()

})().catch((err) => {
    console.log("ERROR", err)
})
