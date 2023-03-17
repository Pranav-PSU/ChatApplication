import React, { useState, useEffect, useContext } from 'react';
import './Chatrooms.css';
import { Card, ListGroup } from 'react-bootstrap';
import { SocketContext } from '../../Context';
import { LinkContainer } from 'react-router-bootstrap';
let socket;
const Chatrooms = () => {
  socket = useContext(SocketContext);
  const [roomlist, setRoomlist] = useState('');

  useEffect(() => {
    socket.emit('getRoomList', (error) => {
      if (error) {
        alert(error);
      }
    });

    socket.on('roomList', ({ roomList }) => {
      setRoomlist([...new Set(roomList)]);
    });
  }, []);

  return (
    <>
      <Card>
        <Card.Header>AVAILABLE CHAT ROOMS</Card.Header>
        <ListGroup variant="flush">
          {roomlist ? (
            <div id="holder">
              <div className="active-container">
                {roomlist.map((name) => (
                  <LinkContainer to={`/join?room=${name}`}>
                    <ListGroup.Item
                      key={name}
                      className="active-item"
                      id="room-tiles"
                    >
                      {name}
                    </ListGroup.Item>
                  </LinkContainer>
                ))}
              </div>
            </div>
          ) : null}
        </ListGroup>
      </Card>
    </>
  );
};

export default Chatrooms;
