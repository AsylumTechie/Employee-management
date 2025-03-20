import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false); // ✅ Instantly updates UI
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md" >
      <div className="container mx-auto flex items-center">
        <div className="text-white text-2xl font-bold">Employee Management</div>

        {/* Pushes the logout button to the rightmost side */}
        <div className="ml-auto">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
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


