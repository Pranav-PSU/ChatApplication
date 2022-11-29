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
      <Card>
        <Card.Header>AVAILABLE CHAT ROOMS</Card.Header>
        <ListGroup variant="flush">
          {roomlist ? (
            <div id="holder">
              <div className="activeContainer">
                {/* <h3 id="chatRoomCardTitle"> AVAILABLE CHAT ROOMS */}
                  {roomlist.map((name) => (
                    <LinkContainer to={`/join?room=${name}`}>
                      <ListGroup.Item key={name} className="activeItem" id="roomTiles">
                        {name}
                      </ListGroup.Item>
                    </LinkContainer>
                  ))}
                {/* </h3> */}
              </div>
            </div>
          ) : null}
        </ListGroup>
      </Card>
      <div id="spacer">

      </div>
    </>
  );
};

export default Chatrooms;
