// // src/contexts/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// // Create AuthContext
// const AuthContext = createContext();

// // AuthProvider component to provide authentication state
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check if there's an authenticated user on page load
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get('/api/auth/me');
//         setUser(response.data);
//       } catch (error) {
//         console.error("Error fetching user", error);
//       }
//     };
    
//     fetchUser();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('/api/auth/login', { email, password });
//       setUser(response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Login error', error);
//       return null;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use AuthContext
// export const useAuth = () => {
//   return useContext(AuthContext);
// };
