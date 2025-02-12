import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL+'/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }  // Explicitly set content type
      );
      

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid credentials from frontend');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
      <div className="w-full max-w-md p-8 bg-white/20 backdrop-blur-md shadow-xl rounded-2xl border border-white/30">
        <h2 className="text-3xl font-semibold text-center text-white">
          Login to Your Account
        </h2>
        <p className="text-center text-white/80 mt-2">
          Welcome back! Please log in to manage your events.
        </p>
        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 pl-10 border rounded-lg bg-white/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="absolute left-3 top-4 text-white/80">📧</span>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 pl-10 border rounded-lg bg-white/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="absolute left-3 top-4 text-white/80">🔒</span>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
          >
            Login
          </button>
        </form>

        {/* <p className="text-center text-white/80 mt-6">
          Don't have an account?{' '}
          <a href="/" className="text-white font-semibold hover:underline">
            Sign Up
          </a>
        </p> */}

        <div className="mt-6 flex items-center justify-between w-full">
          <p className="text-center flex-1 text-white/80">
          Don't have an account?{' '}
            <a
              href="/signup"
              className="text-white font-semibold hover:underline"
            >
              Signup
            </a>
          </p>
          <a
            href="/dashboard"
            className="text-white font-semibold bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Guest Login
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
