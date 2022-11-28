// Setup basic express server
const express = require("express");

const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const frontend_port = process.env.PORT;
const backend_port = process.env.BACKEND_PORT || 3000;
const cors = require("cors");

const {
  initialize_login,
  redirect_auth,
  redirect_not_auth,
  save_user,
} = require("./libs/login_functions.js");

const mongoose = require("mongoose");
const session_middleware = require("./libs/server_control");
const passport = require("passport");

try {
  mongoose.connect("mongodb://127.0.0.1/sample");
} catch (err) {
  console.log(err);
}

app.use(
  cors({
    origin: `http://localhost:${frontend_port}`,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(session_middleware);

app.use(passport.initialize());
app.use(passport.session());

//Initialize the login and passport.use() statements for passport!
initialize_login(passport);

server.listen(backend_port, () => {
  console.log("Server listening at port %d", backend_port);
  console.log(`http://localhost:${backend_port}`);
});

// Routing

app.get("/", redirect_not_auth, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/register", redirect_auth, (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

app.post("/register", redirect_auth, async (req, res) => {
  save_user(req, res);
});

app.get("/login", redirect_auth, (req, res) => {
  // res.sendFile(__dirname + "/public/login.html");
});

app.post(
  "/login",
  (req, res) => {
    const body = req.body;
    console.log(body);
    res.status(200).send();
  }
  // passport.authenticate("local", {
  //   successRedirect: "/",
  //   failureRedirect: "/login",
  //   failureFlash: false,
  // })
);

// Chatroom

let numUsers = 0;

io.on("connection", (socket) => {
  let addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on("new message", (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit("new message", {
      username: socket.username,
      message: data,
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on("add user", (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit("login", {
      numUsers: numUsers,
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: numUsers,
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on("typing", () => {
    socket.broadcast.emit("typing", {
      username: socket.username,
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing", {
      username: socket.username,
    });
  });

  // when the user disconnects.. perform this
  socket.on("disconnect", () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: numUsers,
      });
    }
  });
});
