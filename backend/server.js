const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const http = require("http");
const { socketInitialization } = require("./socketEvents");
const app = express();
const socketServer = http.createServer(app);
const router = require("./router");

// Initialize socket.io
socketInitialization(socketServer);

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

//Test API
app.get("/", (req, res) => {
  res.send({ response: "socketServer is running" });
});

// Start the socketServer
const SOCKETPORT = 4000;
socketServer.listen(SOCKETPORT, () => {
  console.log(`Socket Server running on port ${SOCKETPORT}`);
});

// Start the node server for email service
const NODEPORT = 4001;
app.listen(NODEPORT, () => console.log(`Node Server has started. ${NODEPORT}`));
