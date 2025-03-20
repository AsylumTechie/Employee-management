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
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");


  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    document.body.className = theme;
  }, [theme]); 
  

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div>
      <Router>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-employee" element={<AddEmployee theme={theme} />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<EmployeeDashboard theme={theme} />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
