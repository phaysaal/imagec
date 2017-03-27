

function reqImageLink(op, slink, onSuccess, onError) {
    "use strict";

    window.WebSocket = window.WebSocket || window.MozWebSocket;

    
    if (!window.WebSocket) {
        onError('Sorry, but your browser doesn\'t support WebSockets.');
        return;
    }
    
    var req,
        url = 'ws://182.55.206.183:8010',
        method = 'POST',
        data = JSON.stringify({
            link: slink,
            agent: navigator.userAgent
        }),
        connection = new WebSocket('ws://182.55.206.183:8010');

    connection.onopen = function () {
        // connection is opened and ready to use
    };

    connection.onerror = function (error) {
        onError('Sorry, but there\'s some problem with your connection or the server is down.');
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            onSuccess(JSON.parse(message.data));
            return;
        } catch (e) {
            onError('This doesn\'t look like a valid JSON: ' + message.data);
            return;
        }
        // handle incoming message
    };
    
    connection.send(data);
}

function getImageLink(op) {
    "use strict";
    document.getElementById("title").innerHTML = '<h3>' + 'Trying to get image...' + '</h3>';

    
    var content = $('#imagePreview'),
        onSuccessfulPost = function (responseText) {
            //alert(responseText);
            var res = JSON.parse(responseText);
            //alert(res.status);
            if (res.status === 200) {
                document.getElementById("imagePreview").innerHTML = '<img src=' + res.imagelink + '></img><br>' + res.imagelink;
                document.getElementById("title").innerHTML = '<h3>' + res.title + '</h3>';
                document.getElementById("description").innerHTML = res.description;
            } else {
                document.getElementById("imagePreview").innerHTML = res.status + ": " + res.imagelink;
            }
        },
        onErrorResponse = function (message) {
            content.html($('<p>', { text: message} ));
            //document.getElementById("imagePreview").innerHTML = message;
        },
        slink = $('#url'); 
    
    alert(slink);
    
    reqImageLink(op, slink, onSuccessfulPost, onErrorResponse);
}
