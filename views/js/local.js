function reqImageLinkLocal(op, slink, onSuccess, onError) {
    "use strict";
    var req,
        url = '/ws',
        method = 'POST',
        data = JSON.stringify({
            link: slink,
            agent: navigator.userAgent
        });


    alert(data);
    
    if (XMLHttpRequest) {
        req = new XMLHttpRequest();
        if ('withCredentials' in req) {

            req.open(method, url, true);
            req.setRequestHeader("Content-Type", "application/json");
            req.onerror = onError;
            req.onreadystatechange = function () {

                if (req.readyState === 4) {
                    if (req.status >= 200 && req.status < 400) {
                        onSuccess(req.responseText);
                    } else {
                        onError(new Error('Response returned with non-OK status. \n' + url + '\n' + data));
                    }
                }
            };

            document.getElementById("title").innerHTML = data;
            req.send(data);
        }
    } else if (XDomainRequest) {
        req = new XDomainRequest();
        req.open(method, url);
        req.onerror = onError;
        req.onload = function () {
            onSuccess(req.responseText);
        };
        req.send(data);
    } else {
        onError(new Error('CORS not supported'));
    }
}

function getImageLinkLocal(op) {
    "use strict";
    document.getElementById("title").innerHTML = '<h3>' + 'Trying to get image...' + '</h3>';

    var onSuccessfulPost = function (responseText) {
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
            document.getElementById("imagePreview").innerHTML = message;
        },
        slink = document.getElementById("url").value;

    alert(slink);
    reqImageLinkLocal(op, slink, onSuccessfulPost, onErrorResponse);
}