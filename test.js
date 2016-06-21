/**
 * Created by leonid on 6/16/16.
 */
var http = require("http");
var smtp = require('simplesmtp');
var pop3 = require('pop3');
var imap = require('imap');



http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}).listen(8888);