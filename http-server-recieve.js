/**
 * Created by leonid on 6/23/16.
 */
var http = require('http');
var static = require('node-static');
var file = new static.Server('.');

function accept(req, res) {

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
    });
}

 http.createServer(accept).listen(8080).on('request', function(request, response) {
     response.writeHead(200);
     console.log("methods: "+request.method);
     console.log("headers: "+request.headers);
     console.log("url: "+request.url);
     response.write('hi');
     response.end();
 });

console.log('Server running on port 8080');