import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Toast, ToastContainer, Form, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./join.css";

export default function SignIn() {
  let history = useHistory();
  const [name, setName] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [room, setRoom] = useState("");
  const [showToast, setToastShow] = useState(false);
  useEffect(() => {
    let url = window.location.href;
    let abc = url.split("?")[1];
    if (abc !== undefined) {
      let roomName = abc.split("=")[1];
      console.log(origin);
      setRoom(roomName);
    }
  });

  const checkValidation = (e) => {
    e.preventDefault();
    if (!name) {
      setValidationMessage("Please enter your name");
    } else if (!room) {
      setValidationMessage("Please enter your room name");
    } else {
      console.log("Passed");
      history.push(`/chat?name=${name}&room=${room}`);
    }
    setToastShow(true);
  };

  return (
    <div className="OContainer">
      <div className="IContainer">
        <ToastContainer className="p-3" position="top-center">
          <Toast
            onClose={() => setToastShow(false)}
            show={showToast}
            delay={4000}
            autohide
          >
            <Toast.Header className="toastHeader" closeButton={false}>
              <strong className="me-auto">Chatting Application</strong>
              {/* <small>11 mins ago</small> */}
            </Toast.Header>
            <Toast.Body>{validationMessage}</Toast.Body>
          </Toast>
        </ToastContainer>
        <h2 className="head">Enter Chat Room</h2>
        <InputGroup
          id="sendSection"
          className="mb-3"
          onKeyPress={(event) =>
            event.key === "Enter" ? checkValidation(event) : null
          }
        >
          <div className="inputDiv">
            <Form.Control
              id="joinChatRoomName"
              placeholder="Name"
              className="username"
              type="text"
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="inputDiv">
            <Form.Control
              id="joinChatRoomRoom"
              placeholder="Room"
              className="roomname mt-20"
              type="text"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
            />
          </div>
        </InputGroup>
        <Link onClick={(e) => checkValidation(e)}>
          <button className={"button mt-20"} type="submit">
            Go
          </button>
        </Link>
      </div>
    </div>
  );
}
