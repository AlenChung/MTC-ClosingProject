var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var azure = require('azure-storage');
var blobSvc = azure.createBlobService('13thclosingproject','Ol2bfKtBH5nkw1kxQw6X3IYBe0ziHQvaP4i82ZDUoQDtq4pexMOperzsn4DYv1DwBA6oSttAuGrjq4svcOIjDg==');
var spawn = require('child_process').spawn;
var proc;

app.use('/', express.static(path.join(__dirname, 'stream')));


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
var filename = './stream/image_stream.jpg';

var sockets = {};

io.on('connection', function(socket) {

  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);

  socket.on('disconnect', function() {
    delete sockets[socket.id];

    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  });

  socket.on('start-stream', function() {
    startStreaming(io);
  });

});

http.listen(8000, function() {
  console.log('listening on *:8000');
});

function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false);
    if (proc) proc.kill();
    fs.unwatchFile('./stream/image_stream.jpg');
  }
}

function startStreaming(io) {

  if (app.get('watchingFile')) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    return;
  }

  var args = ["-w", "800", "-h", "600", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "100"];
  proc = spawn('raspistill', args);

  console.log('Watching for changes...');

  app.set('watchingFile', true);

  fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
    io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    
    blobSvc.createBlockBlobFromLocalFile('allenclosing1','allenblob'+Math.floor(Date.now()/1000)+'.jpg','./stream/image_stream.jpg', function(error, result, response) {
      if (error) {
        console.log("Couldn't upload allenclosing stream");
        console.error(error);
        return;
      } 
      console.log('Stream uploaded successfully11111');
    });

   blobSvc.createBlockBlobFromLocalFile('allenclosing2','allenblob'+Math.floor(Date.now()/1000)+'.jpg','./stream/image_stream.jpg', function(error, result, response) {
      if (error) {
        console.log("Couldn't upload allenclosing stream");
        console.error(error);
        return;
      } 
      console.log('Stream uploaded successfully22222');
    });  

//(Math.random()+1)
  })




}
