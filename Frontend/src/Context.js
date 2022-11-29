import React from "react";
import socketio from "socket.io-client";
const APIURL = "http://localhost:4000";

export const socket = socketio.connect(APIURL);
export const SocketContext = React.createContext();
