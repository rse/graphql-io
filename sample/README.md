
GraphQL-IO Samples
==================

These are small examples for GraphQL-IO. For a more realistic
usage, check out the the <a href="https://github.com/huica/unp">Units and Persons (UnP)</a> sample application.

- [1-hello](1-hello/):<br/>
  The simplest possible Client/Server based Hello World.
  This showcases the minimalistic API.

- [2-subscription](2-subscription/):<br/>
  One server, two clients: one client updates a counter,
  the other client is subscribed onto the counter. This
  showcases the query subscription.

- [3-realtime](3-realtime/):<br/>
  One server, one client, two sliders. Pressing LEFT or RIGHT
  on the console changes the left slider. The client then updates the
  slider on the server and receives the new value back and
  updates the right slider. This showcases the realtime performance.

- [4-entities](4-entities/):<br/>
  One server, one client (either in Node.js or in Browser).
  The client updates some entities.
  This showcases the usage in Node.js and the browser.

- [5-cluster](5-cluster/):<br/>
  This shows clustering.

- [6-errors](6-errors/):<br/>
  This shows error handling.

- [7-spa](7-spa/):<br/>
  A small HTML5 Single-Page-Application (SPA).
  This especially showcases the use in the browser.

