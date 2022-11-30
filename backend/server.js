const http = require("http");
const express = require("express");
const app = express();
const socketio = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
var bodyParser = require("body-parser");

const {
  addUserInRoom,
  removeUserFromRoom,
  getUserDetails,
  getUsersInRoom,
  getAllrooms,
} = require("./users");

const {initialize_login} = require("./libs/login_functions");
const mongoose = require("mongoose");
const session_middleware = require("./libs/server_control");
const passport = require("passport");

const router = require("./router");

const server = http.createServer(app);
const io = socketio(server);


// app.use(express.json());
// app.use(express.urlencoded({extended:false}));


//CORS parameters for allowing calls from origin
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());

//Bodyparser initialization
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

app.use(session_middleware);
app.use(passport.initialize());
app.use(passport.session());

initialize_login(passport);


//Router implementation
app.use("/chat/", router);

//Connect to DB for login
try {
  // mongoose.connect(`mongodb+srv://sam:<password>@fullstackcluster.w3kccl2.mongodb.net/test`);
  mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@fullstackcluster.w3kccl2.mongodb.net/logins?retryWrites=true&w=majority`);
  
} catch (err) {
  console.log(err);
}

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

    callback();
  });

  //Event for getting active room list
  socket.on("getRoomList", (callback) => {
    const rooms = getAllrooms();
    let roomListArray = [];
    rooms.forEach((ele, ind) => {
      roomListArray.push(ele.room);
    });
    socket.emit("roomList", { roomList: roomListArray });
    callback();
  });

  //Event for sending messages
  socket.on("sendMessage", (message, callback) => {
    const user = getUserDetails(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
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
    console.log(socket.id + ":" + error);
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
