const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', socket => {
  let userKey = null;
  console.log('a user connected');
  socket.on('request host', key => {
    console.log('remote host', key);
    userKey = key;
    io.emit('remote request', { key });
  });
  socket.on('host offer', ({ key, offer }) => {
    io.emit('host connected', { key, offer });
  });
  socket.on('remote offer', ({ key, offer }) => {
    io.emit('remote connected', { key, offer });
  });
  socket.on('remote ice candidate', ({ key, candidate }) => {
    io.emit('remote candidate', { key, candidate });
  });
  socket.on('host ice candidate', ({ key, candidate }) => {
    io.emit('host candidate', { key, candidate });
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('close', { key: userKey });
  });
});
http.listen(2229, () => console.log(`listening on port 2229!`));
