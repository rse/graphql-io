(async () => {

    /*
    **  ==== SERVER ====
    */

    const { Server } = require("graphql-io-server")

    const server = new Server({ url: "http://127.0.0.1:12345/api" })
    server.at("graphql-schema", () => `
        extend type Root {
            slider: Slider
        }
        type Slider {
            value: Int
            setValue(value: Int): Slider
        }
    `)
    let slider = {
        value: 0
    }
    server.at("graphql-resolver", () => ({
        Root: {
            slider: (obj, args, ctx, info) => {
                ctx.scope.record("Slider", 0, "read", "direct", "one")
                return slider
            }
        },
        Slider: {
            setValue: (obj, args, ctx, info) => {
                slider.value = args.value
                ctx.scope.record("Slider", 0, "update", "direct", "one")
                return slider
            }
        }
    }))
    await server.start()

    /*
    **  ==== CLIENT ====
    */

    let slider1 = 0
    let slider2 = 0
    const displaySliders = () => {
        process.stdout.write(
            "\r" +
            "[" + "#".repeat(slider1) + "-".repeat(20 - slider1) + "]" + " <===> " +
            "[" + "#".repeat(slider2) + "-".repeat(20 - slider2) + "]" + " "
        )
    }

    const { Client } = require("graphql-io-client")

    const client = new Client({ url: "http://127.0.0.1:12345/api" })
    await client.connect()

    let subscription = client.query("subscription { slider { value } }").subscribe((result) => {
        slider2 = result.data.slider.value
        displaySliders()
    })
    let setValue = async (value) => {
        await client.query("mutation ($value: Int) { slider { setValue(value: $value) { value } } }", { value: value })
    }

    const readline = require("readline")
    readline.emitKeypressEvents(process.stdin)
    if (process.stdin.isTTY)
        process.stdin.setRawMode(true)

    process.stdin.on("keypress", (ch, key) => {
        if (key.ctrl && key.name === "c")
            process.exit(0)
        else if (key.name === "left") {
            if (slider1 > 0) {
                slider1--
                displaySliders()
                setValue(slider1)
            }
        }
        else if (key.name === "right") {
            if (slider1 < 20) {
                slider1++
                displaySliders()
                setValue(slider1)
            }
        }
    })
    displaySliders()

})().catch((err) => {
    console.log("ERROR", err)
})
