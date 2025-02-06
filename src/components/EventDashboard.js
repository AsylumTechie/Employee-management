import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();

  const dummyEvents = [
    {
      _id: "1",
      eventName: "Tech Meetup",
      category: "Technology",
      date: "2025-03-15",
    },
    {
      _id: "2",
      eventName: "Startup Pitch Night",
      category: "Business",
      date: "2025-04-10",
    },
    {
      _id: "3",
      eventName: "AI Conference",
      category: "Technology",
      date: "2025-05-20",
    },
    {
      _id: "4",
      eventName: "Music Festival",
      category: "Entertainment",
      date: "2025-06-05",
    },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to access the full view.");
        // Add random attendees when setting dummy data
        const updatedDummyEvents = dummyEvents.map(event => ({
          ...event,
          randomAttendees: Math.floor(Math.random() * (500 - 50 + 1)) + 50, // Between 50 and 500
        }));
        setEvents(updatedDummyEvents);
        setFilteredEvents(updatedDummyEvents);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        const response = await axios.get("http://localhost:8080/api/get-event", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Add random attendees when fetching real data
        const updatedEvents = response.data.map(event => ({
          ...event,
          randomAttendees: Math.floor(Math.random() * (500 - 50 + 1)) + 50, // Between 50 and 500
        }));

        setEvents(updatedEvents);
        setFilteredEvents(updatedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;
    if (categoryFilter) {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }
    if (dateFilter) {
      filtered = filtered.filter((event) => event.date === dateFilter);
    }
    setFilteredEvents(filtered);
  }, [categoryFilter, dateFilter, events]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 ">
      {/* Navbar */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex justify-between items-center shadow-md">
        <h2 className="text-white text-2xl font-bold mx-auto">
          Event Management Dashboard
        </h2>
        {isAuthenticated ? (
         
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
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
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow-md rounded-lg p-4 mx-4 mt-6 space-y-3 md:space-y-0">
        {isAuthenticated && (
          <Link
            to="/event/create"
            className="bg-green-600 text-white text-sm md:text-base px-4 md:mr-6 md:px-6 py-2 py-3 rounded-md shadow-md hover:bg-green-700 transition whitespace-nowrap"
          >
            Create a New Event
          </Link>
        )}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-40 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
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
            className="w-full md:w-40 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition mt-2 md:mt-0"
          />
        </div>
      </div>

      {/* Event List */}
      <div className="p-6">
        {loading && (
          <p className="text-center text-gray-600">Loading events...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white shadow-lg rounded-lg p-5 hover:shadow-2xl transition duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {event.eventName}
                </h3>
                <h4 className="text-lg font-semibold text-gray-900">
                  No. of people attended: {event.randomAttendees}
                </h4>
                <p className="text-sm text-gray-500 mt-1">{event.category}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600">{event.date}</span>
                  {isAuthenticated ? (
                    <Link
                      // to={`/event/${event._id}`}
                      onClick={() => alert("User journey has been completed!")}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition"
                    >
                      View Details
                    </Link>
                  ) : (
                    <button
                    onClick={() => alert("PLease login to get the full access")}
                      className="bg-gray-400 text-white px-3 py-1 rounded-md cursor-not-allowed"
                      // disabled
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-[50vh] ml-500px">
              <p className="text-white text-2xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 rounded-lg shadow-lg">
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
