import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const API_URL = "http://localhost:5002/employees";

export const fetchEmployees = createAsyncThunk("employees/fetchEmployees", async (_, { rejectWithValue }) => {
  try {
    const userId = localStorage.getItem("userId"); 
    const response = await axios.get(`${API_URL}?userId=${userId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch employees");
  }
});

export const addEmployee = createAsyncThunk(
    "employees/addEmployee",
    async (newEmployee, { rejectWithValue }) => {
      try {
        const userId = localStorage.getItem("userId"); 
        
  
        if (!userId) {
          return rejectWithValue("User ID is missing from localStorage");
        }
  
        const employeeWithUser = { ...newEmployee, userId: `${userId}` }; 
  
        const response = await axiosInstance.post("/employees", employeeWithUser);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to add employee");
      }
    }
  );
  

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (updatedEmployee, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/employees/${updatedEmployee.id}`, updatedEmployee);
      return updatedEmployee;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update employee");
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (employeeId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/employees/${employeeId}`);
      return employeeId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete employee");
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex((emp) => emp.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter((emp) => emp.id !== action.payload);
      });
  },
});

export default employeeSlice.reducer;
