import React from "react";
import "./ActivePeople.css";
import { Card, ListGroup } from "react-bootstrap";
const ActivePeople = ({ users }) => (
  <>
    <Card style={{ width: "18rem" }}>
      <Card.Header>Featured</Card.Header>
      <ListGroup variant="flush">
        {users ? (
          <div>
            <h1>People currently chatting:</h1>
            <div className="activeContainer">
              <h2>
                {users.map(({ name }) => (
                  <ListGroup.Item key={name} className="activeItem">
                    {name}
                  </ListGroup.Item>
                ))}
              </h2>
            </div>
          </div>
        ) : null}
      </ListGroup>
    </Card>
  </>
);

export default ActivePeople;
