var express = require('express');
var app = express();

//***************
/* Proxy Server for Unclehub Image Extraction
 * ------------------------------------------
 * Author: Mahmudul Faisal Al Ameen
 * Copyright: Unclehub
 */

var bodyParser = require('body-parser');
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

var gres = null;
var gdata = null;

var domain = '173.66.218.225';
var port = 8010;

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('message', function (message) {
        if (gres !== null) {
            if (message.type === 'utf8') {
                gres.send(message.utf8Data);
                gdata = null;
            }
        }
        connection.close();
    });
    
    function sendData() {
        if (connection.connected) {
            var str = JSON.stringify({link: gdata.link, agent: gdata.agent});
            connection.sendUTF(str);        
        }
    }
    if (gdata !== null && gres !== null) {
        sendData();
    }
});

function proxy (request, response) {
    gres = response;
    gdata = request.body;
//    client.connect('ws://182.55.206.183:8010/', 'image-extraction');
    client.connect('ws://' + domain + ':' + port + '/', 'image-extraction');   
}

//***************

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});

app.get('/ws', function (request, response) {
    response.render('pages/wstest');
});

app.post('/ws', function (request, response) {
    proxy(request, response);
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


