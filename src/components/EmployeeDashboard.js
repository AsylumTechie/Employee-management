import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const EmployeeDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("Overview");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:5002/employees"
        );
        setEmployees(response.data);
        setFilteredEmployees(response.data); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = employees.filter(
      (emp) =>
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query)
    );

    setFilteredEmployees(filtered);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axiosInstance.put(
        `/employees/${currentEmployee.id}`,
        currentEmployee
      );
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === currentEmployee.id ? currentEmployee : emp
        )
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDelete = (employee) => {
    setCurrentEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/employees/${currentEmployee.id}`);
      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== currentEmployee.id)
      );
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const renderContent = useMemo(() => {
    if (selectedMenu === "Overview" || selectedMenu === "Employee") {
      return (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <TextField
              variant="outlined"
              placeholder="Search Employee..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                width: "50%",
                bgcolor: "white",
                borderRadius: "5px",
                input: { color: "black" },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={() => navigate("/add-employee")}
            >
              Add Employee
            </Button>
          </Box>

          <table className="w-full bg-gray-800 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3">First Name</th>
                <th className="p-3">Last Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Age</th>
                <th className="p-3">Gender</th>
                <th className="p-3">Salary</th>
                <th className="p-3">Experince</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="text-center border-b border-gray-700"
                >
                  <td className="p-3">{emp.firstName}</td>
                  <td className="p-3">{emp.lastName}</td>
                  <td className="p-3">{emp.role}</td>

                  <td className="p-3">{emp.age}</td>
                  <td className="p-3">{emp.gender}</td>
                  <td className="p-3">{emp.salary}</td>
                  <td className="p-3">{emp.experience}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(emp)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    }
  }, [selectedMenu, filteredEmployees]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#FFF5E1",
        color: "black",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            bgcolor: "#1E1E1E",
            color: "white",
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: "center", borderBottom: "1px solid gray" }}>
          <Typography variant="h6" fontWeight="bold">
            Velocity Consultancy
          </Typography>
        </Box>
        <List>
          {["Overview", "Employee"].map((item) => (
            <ListItem
              key={item}
              button
              selected={selectedMenu === item}
              onClick={() => setSelectedMenu(item)}
            >
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, bgcolor: "gray.800", color: "white" }}
      >
        {renderContent}
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md" // Increase max width
        fullWidth // Ensures it takes the full width allowed
        PaperProps={{
          sx: {
            bgcolor: "#1E1E1",
            color: "white",
            p: 3, // Add padding for better spacing
            width: "600px", // Custom width if needed
          },
        }}
      >
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            value={currentEmployee?.firstName || ""}
            onChange={(e) =>
              setCurrentEmployee({
                ...currentEmployee,
                firstName: e.target.value,
              })
            }
            sx={{ input: { color: "white" }, label: { color: "gray.400" } }}
          />
          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            value={currentEmployee?.lastName || ""}
            onChange={(e) =>
              setCurrentEmployee({
                ...currentEmployee,
                lastName: e.target.value,
              })
            }
            sx={{ input: { color: "white" }, label: { color: "gray.400" } }}
          />
          <TextField
            fullWidth
            label="Role"
            variant="outlined"
            value={currentEmployee?.role || ""}
            onChange={(e) =>
              setCurrentEmployee({ ...currentEmployee, role: e.target.value })
            }
            sx={{ input: { color: "white" }, label: { color: "gray.400" } }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{ color: "primary" }}
          >
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { bgcolor: "#1E1E1E", color: "white" } }}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {currentEmployee?.firstName}{" "}
          {currentEmployee?.lastName}?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "white" }}
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeDashboard;
