
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated, theme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    navigate("/login");
  };
  

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-center items-center">
        <div className="text-white text-2xl font-bold">Employee Management</div>
        
        <div className="absolute right-0">
        <button
            onClick={toggleTheme}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-2 rounded-lg mr-8"
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg mr-5"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-5"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;