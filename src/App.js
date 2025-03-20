import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmployeeDashboard from "./components/EmployeeDashboard";
import AddEmployee from "./components/AddEmployee";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div>
      <Router>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-employee" element={<AddEmployee />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<EmployeeDashboard />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
