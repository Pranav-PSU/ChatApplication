import React from 'react';
import './ActivePeople.css';
import { Card, ListGroup } from 'react-bootstrap';
const ActivePeople = ({ users }) => (
  <>
    <Card id="active-people-card">
      <Card.Header>Participants</Card.Header>
      <ListGroup variant="flush">
        {users ? (
          <div>
            <div className="active-container">
              <h5>
                {users.map(({ name }) => (
                  <ListGroup.Item
                    key={name}
                    className="active-item"
                    id="people-present-tile"
                  >
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
