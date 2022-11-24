import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Container from "react-bootstrap/Container";
import LinkContainer from "react-router-bootstrap";
import Login from "./components/login.js";
import Home from "./components/home.js";
import Register from "./components/register";

function App() {
  return (
    <main>
      <Container>
        <Router>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/register" exact element={<Register />} />
            <Route path="/login" exact element={<Login />} />
          </Routes>
        </Router>
      </Container>
    </main>
  );
}

export default App;
