import React, { useState, useEffect, useContext } from "react";
import "./Chatrooms.css";
import { Card, ListGroup } from "react-bootstrap";
import io from "socket.io-client";
import { SocketContext } from "../../Context";
import { LinkContainer } from "react-router-bootstrap";
let socket;
const Chatrooms = () => {
  socket = useContext(SocketContext);
  const [roomlist, setRoomlist] = useState("");

  useEffect(() => {
    socket.emit("getRoomList", (error) => {
      if (error) {
        alert(error);
      }
    });

    socket.on("roomList", ({ roomList }) => {
      setRoomlist(roomList);
      //   console.log(roomlist);
    });
  }, []);

  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Header>Featured</Card.Header>
        <ListGroup variant="flush">
          {roomlist ? (
            <div>
              <h1>Available chatrooms</h1>
              <div className="activeContainer">
                <h2>
                  {roomlist.map((name) => (
                    <LinkContainer to={`/join?room=${name}`}>
                      <ListGroup.Item key={name} className="activeItem">
                        {name}
                      </ListGroup.Item>
                    </LinkContainer>
                  ))}
                </h2>
              </div>
            </div>
          ) : null}
        </ListGroup>
      </Card>
    </>
  );
};

export default Chatrooms;
