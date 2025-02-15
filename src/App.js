import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EventDashboard from "./components/EventDashboard";
import EventForm from "./components/EventForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { io } from "socket.io-client";
import "./styles.css";

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  path: "/socket.io",
});

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      ("Connected to WebSocket server");
    });
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/home" element={<EventDashboard />} />
          <Route path="/" element={<EventDashboard />} />
          <Route path="/dashboard" element={<EventDashboard />} />
          <Route path="/event/create" element={<EventForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
