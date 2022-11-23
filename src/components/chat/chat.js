import React from "react";
import { LinkContainer } from "react-router-bootstrap";
const chat = () => {
  return (
    <>
      <h1>Latest Products</h1>
      <LinkContainer to="/dashboard">
        <button type="button" class="btn btn-primary">
          Click me!
        </button>
      </LinkContainer>
    </>
  );
};

export default chat;
