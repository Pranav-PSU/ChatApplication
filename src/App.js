import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import { Container, Switch } from "react-bootstrap";
import Header from "./components/header";
import Footer from "./components/footer";

import Chat from "./components/chat/chat";
import Join from "./components/join/join";
import Dashboard from "./components/dashboard";
function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/join" exact element={<Join />} />
            <Route path="/" exact element={<Chat />} />
            <Route path="/dashboard" exact element={<Dashboard />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
