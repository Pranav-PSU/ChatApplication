import React from "react";
import "./ActivePeople.css";
import { Card, ListGroup } from "react-bootstrap";
const ActivePeople = ({ users }) => (
  <>
    <Card id="activePeoplecard">
      <Card.Header>Participants</Card.Header>
      <ListGroup variant="flush">
        {users ? (
          <div>
            {/* <h1>People currently chatting:</h1> */}
            <div className="activeContainer">
              <h5>
                {users.map(({ name }) => (
                  <ListGroup.Item key={name} className="activeItem" id="peoplePresentTile">
                    {name}
                  </ListGroup.Item>
                ))}
              </h5>
            </div>
          </div>
        ) : null}
      </ListGroup>
    </Card>
  </>
);

export default ActivePeople;
