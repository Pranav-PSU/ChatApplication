// Setup basic express server
const express = require("express");

const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

const {
  initialize_login,
  redirect_auth,
  redirect_not_auth,
  save_user,
} = require("./libs/login_functions.js");
const mongoose = require("mongoose");
const login_model = require("./models/login_schema");
const bcrypt = require("bcrypt");
const session_middleware = require("./libs/server_control");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { v4: uuidv4 } = require("uuid");

try {
  mongoose.connect("mongodb://127.0.0.1/sample");
} catch (err) {
  console.log(err);
}

// login_model.findOne({ email: "hi@gmail.com" }, (err, user) => {
//   if (err) console.log("ERROR");
//   if (user) console.log(user);
//   else
//     console.log("ANOTHER ERROR");
// });

app.use(express.urlencoded({ extended: false }));
app.use(session_middleware);

app.use(passport.initialize());
app.use(passport.session());

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   login_model.findById(id, (err, user) => {
//     done(err, user);
//   });
// });

// passport.use(
//   new localStrategy({ usernameField: "email" }, (email, password, done) => {
//     login_model.findOne({ email: email }, async (err, user) => {
//       if (err) {
//         console.log(err);
//         return done(err);
//       }
//       if (!user) {
//         console.log("No user with that email.");
//         return done(null, false, { message: "No user found with that email." });
//       }

//       //Compare found password
//       const compared_pass = await bcrypt.compare(password, user.password);
//       if (!compared_pass) {
//         console.log("Incorrect pass");
//         return done(null, false, { message: "Incorrect password!" });
//       } else {
//         console.log("Successful");
//         return done(null, user);
//       }
//     });
//   })
// );

// function redirect_not_auth(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   else res.redirect("/login");
// }

// function redirect_auth(req, res, next) {
//   if (req.isAuthenticated()) return res.redirect("/");
//   else return next();
// }

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});

initialize_login(passport);

app.get("/", redirect_not_auth, (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Routing
app.use(express.static(path.join(__dirname, "public")));

app.get("/register", redirect_auth, (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

app.post("/register", redirect_auth, async (req, res) => {
  save_user(req, res);
  // try {
  //   const existing_user = await login_model.find({ email: req.body.email });

  //   if (!existing_user[0]) {
  //     //if not, add them to the database
  //     const pass_hash = await bcrypt.hash(req.body.password, 10);

  //     const response = await login_model.create({
  //       username: req.body.name,
  //       email: req.body.email,
  //       password: pass_hash,
  //       uuid: uuidv4(),
  //     });

  //     console.log(`document that was added =>`, response);
  //     res.redirect("/login");
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.redirect("/register");
  // }
});

app.get("/login", redirect_auth, (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: false,
  })
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
