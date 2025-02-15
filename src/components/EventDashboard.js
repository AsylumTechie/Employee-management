import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [joinedEvents, setJoinedEvents] = useState({}); 
  const navigate = useNavigate();

  const socket = io(process.env.REACT_APP_SOCKET_URL, {
    transports: ["websocket", "polling"], 
  });

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setError("Please log in to access the full view.");
      return;
    }
  
    setIsAuthenticated(true);
  
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); 
      const userId = decodedToken.userId; 
  
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-event`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setEvents(response.data);
  
      const joinedStatus = {};
      response.data.forEach((event) => {
        joinedStatus[event._id] = event.attendees.includes(userId); 
      });
  
      setJoinedEvents(joinedStatus);
    } catch (error) {
      console.error("Error fetching events:", error);
    } 
  };
  

  useEffect(() => {
    fetchEvents();

    const handleEventJoined = ({ eventId, attendees }) => {
      console.log(attendees);

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, attendees } : event
        )
      );

      setJoinedEvents((prev) => ({
        ...prev,
        [eventId]: attendees.includes("userId"), 
      }));
    };

    socket.on("eventUpdated", handleEventJoined);

    return () => {
      socket.off("eventUpdated", handleEventJoined);
    };
  }, []);

  const handleJoinEvent = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to join or leave the event.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/join-event`,
        { eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        const { isJoined } = response.data; 
        setJoinedEvents((prev) => ({
          ...prev,
          [eventId]: isJoined, 
        }));
      }
    } catch (error) {
      console.error("Error updating event status:", error);
      alert("Failed to update event status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#181818] via-[#1E1E2E] to-[#111827] text-white p-6">
      {/* Navbar */}
      <div className="bg-gray-700 p-4 flex justify-between items-center shadow-md">
        <h2 className="text-white text-2xl font-bold mx-auto">
          Event Dashboard
        </h2>
        {isAuthenticated ? (
          <button
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            onClick={() => {
              localStorage.removeItem("token");
              setIsAuthenticated(false);
              navigate("/login");
            }}
          >
            Logout
          </button>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800 shadow-md rounded-lg p-4 mx-4 mt-6 space-y-3 md:space-y-0">
        {isAuthenticated && (
          <Link
            to="/event/create"
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 "
          >
            Create Event
          </Link>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <option value="">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Entertainment">Entertainment</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 bg-gray-700 text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 mt-2 md:mt-0"
          />
        </div>
      </div>

      {/* Event List */}
      <div className="p-6 mt-25">
        
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-gray-800 shadow-md rounded-lg p-5 hover:shadow-xl transition"
              >
                <h3 className="text-lg font-semibold text-white">
                  {event.eventName}
                </h3>
                <p className="text-sm text-white mt-1">{event.category}</p>
                <p className="text-sm text-white mt-1">
                  Attendees = {(event.attendees || []).length}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-white">{event.date}</span>
                  {isAuthenticated ? (
                    <button
                      onClick={() => handleJoinEvent(event._id)}
                      className={`px-3 py-1 rounded-md transition ${
                        joinedEvents[event._id]
                          ? "bg-red-600 hover:bg-red-500"
                          : "bg-green-600 hover:bg-green-500"
                      } text-white`}
                    >
                      {joinedEvents[event._id] ? "Leave Event" : "Join Event"}
                    </button>
                  ) : (
                    <button
                      onClick={() => alert("Please login to join the event")}
                      className="bg-gray-500 text-white px-3 py-1 rounded-md cursor-not-allowed"
                    >
                      Join Event
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-[50vh]">
              <p className="text-gray-400 text-2xl font-semibold px-6 py-4 rounded-lg shadow-lg">
                No events match the selected filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
