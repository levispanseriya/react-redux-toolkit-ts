import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const login = createAsyncThunk("login", async (payload) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/login",
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
});

const signIn = createAsyncThunk("signIn", async (payload) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/signin",
      payload
    );
    return res.data;
  } catch (error) {
    throw { error: error.response.data };
  }
});

const forgotPassword = createAsyncThunk("forgotPassword", async (payload) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/forgot-password",
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
});

const resetPassword = createAsyncThunk("reset-password", async (payload) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/auth/reset-password",
      payload
    );
    return res.data;
  } catch (error) {
    throw error;
  }
});

// const deleteCustomer = createAsyncThunk("deleteCustomer", async (id) => {
//   try {
//     const res = await axios.get(
//       `http://localhost:5000/api/customer/deleteCustomer/${id}`
//     );
//     return res.data;
//   } catch (error) {
//     throw error;
//   }
// });

export { signIn, login, forgotPassword, resetPassword };
