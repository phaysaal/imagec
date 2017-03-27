var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/ws', function(request, response) {
    response.render('pages/wstest');
} );

app.post('/ws', function(request, response) {
    var str = JSON.stringify({status: 409, imagelink: "", title: "", description: "K! It's cool!!"});
    response.send(str);
} )

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


