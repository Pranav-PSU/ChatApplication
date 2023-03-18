const socketio = require("socket.io");
const {
  addUserInRoom,
  removeUserFromRoom,
  getUserDetails,
  getUsersInRoom,
  getAllRooms,
} = require("./users");

let io;

const socketInitialization = (server) => {
  io = socketio(server);

  io.on("connect", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
      try {
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
      } catch (error) {
        console.error("Error occurred in join", error);
        return callback(error);
      }
      return callback();
    });

    socket.on("getRoomList", (callback) => {
      try {
        const rooms = getAllRooms();
        const roomListArray = [];
        rooms.forEach((ele, ind) => {
          roomListArray.push(ele.room);
        });
        socket.emit("roomList", { roomList: roomListArray });
        return callback();
      } catch (error) {
        console.error("Error occurred in getRoomList", error);
        return callback(error);
      }
    });

    socket.on("sendMessage", (message, callback) => {
      try {
        const user = getUserDetails(socket.id);

        io.to(user.room).emit("message", { user: user.name, text: message });

        return callback();
      } catch (error) {
        console.error("Error occurred in sendMessage", error);
        return callback(error);
      }
    });

    socket.on("disconnect", () => {
      try {
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
      } catch (error) {
        console.error("Error occurred in disconnect", error);
      }
    });
    socket.on("error", function (error) {
      console.log(`${socket.id}: ${error}`);
    });
  });
};

module.exports = { socketInitialization };
