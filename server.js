const express = require("express");
const io = require("socket.io");

const app = express();
const chat = io(app.listen(3000));

app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.redirect("index.html");
});

// var userNames = {};
// chat.on('setSocketId', function(data) {
//     var userName = data.name;
//     var userIdSocket = data.userIdSocket;
//     userNames[userName] = userIdSocket;
// });

let users = [];

chat.on("connection", user => {
  user.on('user connected', name => {
    user.name = name;
    users.push(name);

    chat.emit("users connected", chat.engine.clientsCount, users);
  });


  user.on("chat message", msg => {
    chat.emit("chat message", msg);
  });

  user.on('disconnect', () => {
    users = users.filter(name => name == user.name);
    chat.emit("user disconnected", user.name);
  });
});