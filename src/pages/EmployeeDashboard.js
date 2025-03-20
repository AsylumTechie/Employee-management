import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import EmployeeTable from "../components/EmployeeTable";
import EditEmployeeDialog from "../components/EditEmployeeDialog";
import DeleteEmployeeDialog from "../components/DeleteEmployeeDialog";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("Overview");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get("/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    await axiosInstance.put(`/employees/${currentEmployee.id}`, currentEmployee);
    setEmployees((prev) => prev.map((emp) => (emp.id === currentEmployee.id ? currentEmployee : emp)));
    setEditDialogOpen(false);
  };

  const handleDelete = (employee) => {
    setCurrentEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    await axiosInstance.delete(`/employees/${currentEmployee.id}`);
    setEmployees((prev) => prev.filter((emp) => emp.id !== currentEmployee.id));
    setDeleteDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FFF5E1" }}>
      <Sidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <EmployeeTable employees={employees} handleEdit={handleEdit} handleDelete={handleDelete} searchQuery={searchQuery} navigate={navigate} />
      <EditEmployeeDialog open={editDialogOpen} handleClose={() => setEditDialogOpen(false)} employee={currentEmployee} handleSave={handleEditSubmit} />
      <DeleteEmployeeDialog open={deleteDialogOpen} handleClose={() => setDeleteDialogOpen(false)} confirmDelete={confirmDelete} employee={currentEmployee} />
    </Box>
  );
};

export default EmployeeDashboard;
