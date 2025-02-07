import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EventDashboard from "./components/EventDashboard";
import EventForm from "./components/EventForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
// import { AuthProvider } from "./contexts/AuthContext.js";
import { io } from "socket.io-client";
import "./styles.css";

const socket = io("http://localhost:8080"); // backend server URL

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/en/home" element={<EventDashboard />} />
          <Route path="/event/create" element={<EventForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/en/home" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
