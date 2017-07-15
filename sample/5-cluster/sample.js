
(async () => {
    const { Server } = require("graphql-io-server")
    const { Client } = require("graphql-io-client")
    const cluster = require("cluster")

    if (cluster.isMaster) {
        setTimeout(async () => {
            const client = new Client({ url: "http://127.0.0.1:12345/api" })
            await client.connect()
            let subscription = client.query(`
                subscription {
                    _Server {
                        load
                        requests
                        clients
                    }
                }
            `).subscribe((result) => {
                console.log("Client: Result:", result.data)
            })
        }, 2 * 1000)

        setTimeout(() => {
            setInterval(async () => {
                const client = new Client({ url: "http://127.0.0.1:12345/api" })
                await client.connect()
                let count = 0
                let timer = setInterval(async () => {
                    let response = await client.query(`query { _Server { version } }`)
                    console.log(response.data)
                    if (count++ > 100) {
                        clearTimeout(timer)
                        await client.disconnect()
                    }
                }, 5 * 1000 * Math.random())
            }, 1 * 100 * Math.random())
        }, 4 * 1000)

        for (let i = 0; i < 8; i++)
            cluster.fork()
        cluster.on("exit", (worker, code, signal) => {
            console.log(`worker ${worker.process.pid} terminated`)
        })
    }

    console.log(`${cluster.isMaster ? "master" : "worker"} ${process.pid} started`)
    const server = new Server({ url: "http://127.0.0.1:12345/api", pubsub: "mpm:foo", keyval: "mpm:foo" })
    server.at("graphql-query", () => console.log(`${cluster.isMaster ? "master" : "worker"} ${process.pid} query`))
    await server.start()

})().catch((err) => {
    console.log("ERROR", err)
})

