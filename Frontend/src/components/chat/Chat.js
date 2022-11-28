import React, { useState, useEffect, useContext } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import ActivePeople from "../ActivePeople/ActivePeople";
import { Card, Button, InputGroup, Form, Modal } from "react-bootstrap";
import "./chat.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Message from "../Message/Message";
import ScrollToBottom from "react-scroll-to-bottom";
import { SocketContext } from "../../Context";
const APIURL = "http://localhost:4000";

let socket;

const Chat = ({ location }) => {
  socket = useContext(SocketContext);
  let id = useParams();
  console.log(id);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [show, setShow] = useState(false);
  const [emailaddress, setEmailAddress] = useState("");
  // const [roomlist, setRoomlist] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    // socket = io(APIURL);

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [APIURL, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };
  const invitePeople = (event) => {
    event.preventDefault();

    console.log(emailaddress);
    if (emailaddress !== null) {
      let url = window.location.href;
      let origin = window.location.origin;
      let splitUrl = url.split("?")[1];
      let splitUrl1 = splitUrl.split("&")[1];

      const options = {
        url: `${origin}?${splitUrl1}`,
        email: emailaddress,
      };

      axios
        .post("http://localhost:4001/chat/invitePeople", options)
        .then((response) => {
          if (response.status == 200) {
            console.log(response);
            handleClose();
          }
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(`${origin}?${splitUrl1}`);
    }
  };

  return (
    <div className="outerContainer">
      <Card>
        <Card.Header>
          {room}
          <Button className="" variant="info" onClick={(e) => handleShow()}>
            Invite
          </Button>
        </Card.Header>

        <Card.Body>
          {/* <Messages messages={messages} name={name} /> */}
          <ScrollToBottom className="messages">
            {messages.map((message, i) => (
              <div key={i}>
                <Message message={message} name={name} />
              </div>
            ))}
          </ScrollToBottom>
          <InputGroup
            className="mb-3"
            placeholder="Type a message..."
            value={message}
            onChange={({ target: { value } }) => setMessage(value)}
            onKeyPress={(event) =>
              event.key === "Enter" ? sendMessage(event) : null
            }
          >
            <Form.Control aria-label="Example text with two button addons" />
            <Button variant="outline-secondary" onClick={(e) => sendMessage(e)}>
              Send
            </Button>
            <Button variant="outline-secondary">Reset</Button>
          </InputGroup>
        </Card.Body>
      </Card>
      <ActivePeople users={users} />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label htmlFor="inputPassword5">Password</Form.Label>
          <Form.Control
            type="email"
            id="emailtext"
            placeholder="Email address"
            onChange={({ target: { value } }) => setEmailAddress(value)}
          />
          <Form.Text id="passwordHelpBlock" muted>
            Enter email address to whome you want to invite in this chatroom
          </Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={(e) => invitePeople(e)}>
            Invite
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Chat;
