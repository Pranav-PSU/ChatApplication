const http = require("http");
const express = require("express");
const app = express();
const socketio = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");

const {
  addUserInRoom,
  removeUserFromRoom,
  getUserDetails,
  getUsersInRoom,
  getAllRooms,
} = require("./users");
const router = require("./router");

const server = http.createServer(app);
const io = socketio(server);

//Bodyparser initialization
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

// Middleware to enable CORS
app.use(cors());

//Router implementation
app.use("/chat/", router);

//Socket Events and Listners
io.on("connect", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUserInRoom({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit("message", {
      user: "welcomeText",
      text: `Hello ${user.name}, Welcome to the ${user.room}.  Happy Chatting! `,
    });
    socket.broadcast.to(user.room).emit("message", {
      user: "welcomeText",
      text: `${user.name} has joined!`,
    });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    return callback();
  });

  //Event for getting active room list
  socket.on("getRoomList", (callback) => {
    const rooms = getAllRooms();
    const roomListArray = [];
    rooms.forEach((ele, ind) => {
      roomListArray.push(ele.room);
    });
    socket.emit("roomList", { roomList: roomListArray });
    return callback();
  });

  //Event for sending messages
  socket.on("sendMessage", (message, callback) => {
    const user = getUserDetails(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    return callback();
  });

  //Socket disconnect event
  socket.on("disconnect", () => {
    const user = removeUserFromRoom(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "welcomeText",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
  socket.on("error", function (error) {
    console.log(`${socket.id}: ${error}`);
  });
});

//Test API
app.get("/", (req, res) => {
  res.send({ response: "Server is running" });
});

//Server for Socket Events
server.listen(4000, () => console.log(`Socket server has started.`));

//Server for other APIs
app.listen(4001, () => console.log(`Server has started.`));
