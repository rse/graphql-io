
[GraphQL-IO-Meta](https://github.com/rse/graphql-io) &nbsp;|&nbsp;
[GraphQL-IO-Client](https://github.com/rse/graphql-io-client) &nbsp;|&nbsp;
[GraphQL-IO-Server](https://github.com/rse/graphql-io-server)

<img src="https://rawgit.com/rse/graphql-io/master/graphql-io.svg" width="250" align="right" alt=""/>

GraphQL-IO
==========

GraphQL Network Communication Framework (Meta Package)

<p/>
<img src="https://nodei.co/npm/graphql-io.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/graphql-io.png" alt=""/>

About
-----

This is a [GraphQL](http://graphql.org/)-based network communication framework for
JavaScript clients, running under either Node.js or in the Browser,
and JavaScript servers, running under Node.js.
The client-side is provided by the module
[GraphQL-IO-Client](https://github.com/rse/graphql-io-client),
the server-side is provided by the module
[GraphQL-IO-Server](https://github.com/rse/graphql-io-server).
This is just a meta-package which bundles
the server and client packages for being able to conveniently reference both
the server and the client in their latest versions through a single package.
Feel free to just use (particular versions of) the individual packages directly.

On the client-side, it is based on the GraphQL engine [GraphQL.js](http://graphql.org/graphql-js/), the
GraphQL client library [Apollo Client](https://github.com/apollographql/apollo-client), its
WebSocket network interface [Apollo Client WS](https://github.com/rse/apollo-client-ws)
and the HTTP client library [Axios](https://github.com/mzabriskie/axios).

On the server-side, it is based on the GraphQL engine [GraphQL.js](http://graphql.org/graphql-js/),
the GraphQL schema execution library [GraphQL-Tools](http://dev.apollodata.com/tools/graphql-tools/),
the GraphQL type definition library [GraphQL-Tools-Types](https://github.com/rse/graphql-tools-types),
the GraphQL subscription management library [GraphQL-Tools-Subscribe](https://github.com/rse/graphql-tools-subscribe),
the network communication framework [HAPI](https://hapijs.com),
the WebSocket integration plugin [HAPI-Plugin-WebSocket](https://github.com/rse/hapi-plugin-websocket)
and the GraphiQL integration plugin [HAPI-Plugin-GraphiQL](https://github.com/rse/hapi-plugin-graphiql).

Installation
------------

```shell
# all-in-one
$ npm install graphql-io

# client-side only
$ npm install graphql-io-client

# server-side only
$ npm install graphql-io-server
```

Usage
-----

```js
/*  all-in-one  */
import { Client } from "graphql-io"
import { Server } from "graphql-io"

/*  client-side only  */
import { Client } from "graphql-io-client"

/*  server-side only  */
import { Server } from "graphql-io-server"
```

For particular usage details, please see the
[GraphQL-IO-Client](https://github.com/rse/graphql-io-client) package
and its [GraphQL-IO-Client API](https://github.com/rse/graphql-io-client/blob/master/src/graphql-io.d.ts)
and the [GraphQL-IO-Server](https://github.com/rse/graphql-io-server) package
and its [GraphQL-IO-Server API](https://github.com/rse/graphql-io-server/blob/master/src/graphql-io.d.ts).

Sample
------

```js
/*  Hello World Server  */
const { Server } = require("graphql-io-server")
const server = new Server({ url: "http://127.0.0.1:12345/api" })
server.at("graphql-resolver", () => ({
    Root: { hello: [ "hello: String", () => "world" ] }
}))
await server.start()
```

```js
/*  Hello World Client  */
const { Client } = require("graphql-io-client")
const client = new Client({ url: "http://127.0.0.1:12345/api" })
await client.connect()
let result = await client.query("{ hello }")
await client.disconnect()
console.log(result.data)
```

For more elaborate samples, check out the [Samples](https://github.com/rse/graphql-io/tree/master/sample/) folder.
These samples show a minimum Hello World, subscriptions over separate client connections,
real-time performance of server, usage from within Node.js and the Browser, etc.

License
-------

Copyright (c) 2016-2017 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

