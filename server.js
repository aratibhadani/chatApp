require('dotenv').config();
const express = require('express');
const Response = require('./src/service/Response');
const app = express();
const http = require('http').createServer(app); //pass app in http server create
const port = process.env.PORT || 3000;
var socketsArr = [];

app.set('view engine', 'ejs');
http.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
app.use(express.static(__dirname + '/public')); //serve .css file

// for Group Chat
app.get('/groupchat', (req, res) => {
  res.render('groupChat');
});

// For Individual chat
app.get('/individualchat', (req, res) => {
  res.render('individualChat');
});

// For Channel chat
app.get('/channelchat', (req, res) => {
  res.render('channelChat');
});

app.get('/listclient/:id', async (req, res) => {
  let roomName = req.params.id;
  console.log(roomName);
  const roomIdList = Array.from(await channelnsp.in(roomName).allSockets());
  console.log('RoomList', roomIdList);
  let roomUserListArr = [];
  roomIdList.map((item) => {
    roomUserListArr.push(socketsArr.find((user) => user.userId == item));
  });
  console.log('room Data->', roomUserListArr);
  Response.successResponseData(res, roomUserListArr, 1, `Channel List...`)
});


const io = require('socket.io')(http); // Using that http server create socket variable

//Socket
/** group chat senario */

io.on("connection", (socket) => {

  //for creating User
  socket.on("new-connect-user", userName => {
    socketsArr.push({
      userId: socket.id,
      name: userName
    });
    socket.broadcast.emit('inform-to-all', userName);
  });

  //for send and receive msg
  socket.on("send-message", function (msg) {
    console.log(msg); //sender data
    socket.broadcast.emit('receive-message', msg);
  });

});


// /** 1-1 chat senario */
//creating namespace for individual chat
const insp = io.of("/individual-namespace");

insp.on("connection", socket => {
  let findData
  console.log("someone connected...");
  socket.on('find-name', findUserName => {
    findData = socketsArr.find((user) => user.name == findUserName);

    console.log('find data->', findData.userId);
    socket.emit('send-name', findData);
  });

  //for creating User
  socket.on("new-connect-user", userName => {
    socketsArr.push({
      userId: socket.id,
      name: userName
    });
    socket.broadcast.emit('inform-to-all', userName);
  });

  //   //for send and receive msg
  socket.on("send-message", function (msg) {
    console.log('message->', msg); //sender data
    socket.to(msg.sendTo).emit("receive-message", msg);
  });
});


/** channal chat senario */
//creating namespace for channel chat
const channelnsp = io.of("/channel-namespace");

channelnsp.on("connection", socket => {

  console.log('channel chat')
  //Creating New user
  socket.on("new-connect-user", userName => {
    socketsArr.push({
      userId: socket.id,
      name: userName,
      roomId: `channel${socket.id}`
    });
    socket.join(`channel${socket.id}`); //Join to room
    channelnsp.to(`channel${socket.id}`).emit('connectToRoom', `channel${socket.id}`);
  });

  let findData;
  socket.on('find-name', findUserName => {
    console.log('data', socketsArr);
    findData = socketsArr.find((user) => user.name == findUserName);

    console.log('find data->', findData);
    socket.emit('send-name', findData);
  });

  socket.on("send-message", function (msg) {
    console.log('message->', msg); //sender data
    channelnsp.to(msg.sendTo).emit("receive-message", msg);
  });
});






