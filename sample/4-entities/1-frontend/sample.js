
/*  external requirements  */
const { inspect } = require("util")
const { Client }  = require("graphql-io-client")

/*  helper function for dumping data structure  */
const dump = (data) => {
    if (process.browser)
        data = JSON.stringify(data, null, "    ")
    else
        data = inspect(data, { colors: true, depth: null })
    return data
}

/*  create a GraphQL-IO client service instance  */
const newService = async (id) => {
    const sv = new Client({
        url:      "http://127.0.0.1:12345/api",
        encoding: "json",
        debug:    1
    })
    sv.on("debug", ({ log }) => {
        console.error(`${id}: ${log}`)
    })
    await sv.connect()
    return sv
}

/*  execute asynchronous function in a wrapping procedure  */
;(async () => {
    /*  create two client service instances  */
    const sv1 = await newService("sv1")
    const sv2 = await newService("sv2")

    /*  the first service continuously queries...  */
    let subscription = sv1.query(`subscription {
        OrgUnits {
            id
            name
            director   { id name }
            parentUnit { id name }
            members    { id name }
        }
    }`).subscribe((response) => {
        console.log(`sv1: response: ${dump(response)}`)
    }, (err) => {
        console.log(`sv1: ERROR: ${err}`)
    })

    /*  the second service manipulates multiple times...  */
    let cnt = 0
    let timer = setInterval(async () => {
        await sv2.query(`mutation ($with: JSON!) {
            OrgUnit (id: "XT") {
                update(with: $with) {
                    name
                }
            }
        }`, {
            with: {
                name: `dummy${cnt}`
            }
        }).then((response) => {
            console.log(`sv2: response: ${dump(response)}`)
        }, (err) => {
            console.log(`sv2: ERROR: ${err}`)
        })
        if (cnt++ >= 2) {
            /*  stop processing  */
            clearTimeout(timer)
            setTimeout(async () => {
                await subscription.unsubscribe()
                await sv1.disconnect()
                if (!process.browser)
                    process.exit(0)
            }, 1 * 1000)
        }
    }, 1 * 1000)
})().catch((err) => {
    console.log(`global: ERROR: ${err}`)
})

