import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./join.css";

export default function SignIn() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    let url = window.location.href;
    let abc = url.split("?")[1];
    if (abc !== undefined) {
      let roomName = abc.split("=")[1];
      console.log(origin);
      setRoom(roomName);
    }
  });

  const checkUrl = () => {};

  return (
    <div className="OContainer">
      <div className="IContainer">
        <h1 className="head">Enter Details</h1>
        <div>
          <input
            placeholder="Name"
            className="username"
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="Room"
            className="roomname mt-20"
            type="text"
            value={room}
            onChange={(event) => setRoom(event.target.value)}
          />
        </div>
        <Link
          onClick={(e) => (!name || !room ? e.preventDefault() : null)}
          to={`/chat?name=${name}&room=${room}`}
        >
          <button className={"button mt-20"} type="submit">
            Enter in a chatroom
          </button>
        </Link>
      </div>
    </div>
  );
}
