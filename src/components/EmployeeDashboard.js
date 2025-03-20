import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  updateEmployee,
  deleteEmployee,
} from "../redux/employeeSlice";
import "../styles.css";

const EmployeeDashboard = ({ theme }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employees = useSelector((state) => state.employees.list);

  const [selectedMenu, setSelectedMenu] = useState("Overview");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      const filtered = employees.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(query) ||
          emp.lastName.toLowerCase().includes(query) ||
          emp.role.toLowerCase().includes(query)
      );
      setFilteredEmployees(filtered);
    },
    [employees]
  );

  const handleEdit = (employee) => {
    setCurrentEmployee({ ...employee });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (!currentEmployee) return;

    dispatch(updateEmployee(currentEmployee))
      .unwrap()
      .then(() => {
        setEditDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error updating employee:", error);
      });
  };

  const handleDelete = (employee) => {
    setCurrentEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!currentEmployee) return;

    dispatch(deleteEmployee(currentEmployee.id))
      .unwrap()
      .then(() => {
        setDeleteDialogOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
      });
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
                <th className="p-3">Experience</th>
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
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "red" }}
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
  }, [
    selectedMenu,
    searchQuery,
    handleSearchChange,
    filteredEmployees,
    navigate,
  ]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme === "light" ? "#FFF5E1" : "gray.900",
        color: "black",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          "& .MuiDrawer-paper": {
            width: 240,
            bgcolor: "#1F2937",
            color: "white",
          },
        }}
      >
        <Box
          sx={{ p: 2.5, textAlign: "center", borderBottom: "1px solid gray" }}
        >
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

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: theme === "light" ? "#FFF5E1" : "white",
            color: theme === "light" ? "black" : "white",
            borderRadius: "8px",
            padding: "24px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "22px" }}>
          Edit Employee
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="First Name"
              value={currentEmployee?.firstName || ""}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  firstName: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={currentEmployee?.lastName || ""}
              onChange={(e) =>
                setCurrentEmployee({
                  ...currentEmployee,
                  lastName: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Role"
              value={currentEmployee?.role || ""}
              onChange={(e) =>
                setCurrentEmployee({ ...currentEmployee, role: e.target.value })
              }
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", padding: "16px" }}>
          <Button onClick={() => setEditDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{
          backdrop: {
            sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, 
          },
          paper: {
            sx: {
              backgroundColor: theme === "light" ? "#FFF5E1" : "white",
              color: theme === "light" ? "black" : "white",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center", 
            },
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "20px", fontWeight: "bold" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete{" "}
            <strong>{currentEmployee?.firstName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeDashboard;
