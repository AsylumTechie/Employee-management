import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axiosInstance.post(
        "https://manage-employee-nml5.onrender.com/users",
        {
          userName,
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken); 

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1D1D2C] to-[#111827]">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg shadow-xl rounded-xl border border-white/20">
        <h2 className="text-3xl font-semibold text-center text-white">
          Create an Account
        </h2>
        <p className="text-center text-gray-300 mt-2">
          Join us and start managing your Employees effortlessly.
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-900/40 p-2 mt-4 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="User Name"
              className="w-full p-4 pl-12 border border-gray-600 rounded-lg bg-white/20 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <span className="absolute left-4 top-4 text-gray-400">👤</span>
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 pl-12 border border-gray-600 rounded-lg bg-white/20 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="absolute left-4 top-4 text-gray-400">📧</span>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 pl-12 border border-gray-600 rounded-lg bg-white/20 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="absolute left-4 top-4 text-gray-400">🔒</span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 flex justify-between items-center">
          <p className="text-gray-300">Don't have an account?</p>
          <a
            href="/login"
            className="text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
