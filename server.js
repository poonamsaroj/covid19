//Install express server
const express = require('express');
const path = require('path');
var cors = require('cors')

let corsOptions = {
    credentials: true,
    origin: [process.env.ORIGIN_URL, 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT']
}

const app = express();

app.use(cors(corsOptions));
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/covid19'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/covid19/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);