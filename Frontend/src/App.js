import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/header";
import Footer from "./components/footer";

import Chat from "./components/chat/Chat";
import Join from "./components/join/join";
import Dashboard from "./components/dashboard";
import Chatrooms from "./components/Chatrooms/Chatrooms";
import { SocketContext, socket } from "./Context";
function App() {
  return (
    <Router>
      <SocketContext.Provider value={socket}>
        <Header />
        <main className="py-3">
          <Container>
            <Switch>
              <Route path="/" exact component={Join} />
              <Route path="/login" exact component={Join} />
              <Route path="/join" exact component={Join} />
              <Route path="/chat" component={Chat} />
              <Route path="/chatrooms" component={Chatrooms} />
            </Switch>
          </Container>
        </main>
        <Footer />
      </SocketContext.Provider>
    </Router>
  );
}

export default App;
