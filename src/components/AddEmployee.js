import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addEmployee } from "../redux/employeeSlice";

const AddEmployee = ({ theme }) => {
  const dispatch = useDispatch();
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    role: "",
    experience: "",
    salary: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
  
    try {
      await dispatch(addEmployee(employee)).unwrap(); 
      navigate("/dashboard"); 
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };
  

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: theme === "light" ? "#FFF5E1" : "#1F2937",
        color: theme === "light" ? "black" : "black",
      }}
    >
      <div
        className="p-6 rounded-lg shadow-md w-full max-w-md"
        style={{ backgroundColor: theme === "light" ? "white" : "#374151" }} 
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Add Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={employee.firstName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={employee.lastName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={employee.age}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <select
            name="gender"
            value={employee.gender}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={employee.role}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="number"
            name="experience"
            placeholder="Years of Experience"
            value={employee.experience}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={employee.salary}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <textarea
            name="address"
            placeholder="Address"
            value={employee.address}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
          >
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
