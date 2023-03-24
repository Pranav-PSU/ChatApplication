import React from "react";
import socketio from "socket.io-client";

export const APIURL = "http://localhost:4000";
export const SOCKETAPIURL = "http://localhost:4001/chat/";
export const CHATAPI= "chatroomInvitation";

export const socket = socketio.connect(APIURL);
export const SocketContext = React.createContext();
