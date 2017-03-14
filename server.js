var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var index = require('./server/routes/index');
var api = require('./server/routes/api');

//View Engine
app.set('views', path.join(__dirname, ''));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Static Folder
app.use(express.static(path.join(__dirname, '')));

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/api', api);

// Catch all other routes and return the index file
//app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, 'index.html'));
//});


io.set("origins", "*:*");
io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        //client disconnected
    });

    socket.on('donorAdded', (donor) => {
        io.emit('updateMap', { type: 'donorAdded', donor: donor });
    });
    socket.on('donorUpdated', (donor) => {
        io.emit('updateMap', { type: 'donorUpdated', donor: donor });
    });
    socket.on('donorDeleted', (donor) => {
        io.emit('updateMap', { type: 'donorDeleted', donor: donor });
    });
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

http.listen(port, function () {
    console.log("Server started at " + port);
});
