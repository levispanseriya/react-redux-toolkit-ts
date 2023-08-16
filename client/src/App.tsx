import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/Components/Login";
import SignIn from "../src/Components/SignIn";
import ResetPassword from "../src/Components/ResetPassword";
import ForgotPassword from "../src/Components/ForgotPassword";
import Add from "../src/Components/Form/Add";
import List from "../src/Components/Form/List";

function App() {
  const handleLoginSubmit = (email: String, password: String) => {};
  const handleSignupSubmit = (email: String, password: String) => {};
  const handleForgotPasswordSubmit = (email: String) => {};
  const handleResetPasswordSubmit = (password: String) => {};

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/add" element={<Add />} />
        <Route path="/list" element={<List />} />
        <Route
          path="/login"
          element={<Login onSubmit={handleLoginSubmit} />}
        ></Route>
        <Route
          path="/signIn"
          element={<SignIn onSubmit={handleSignupSubmit} />}
        ></Route>
        <Route
          path="/resetPassword"
          element={<ResetPassword onSubmit={handleResetPasswordSubmit} />}
        ></Route>
        <Route
          path="/forgotPassword"
          element={<ForgotPassword onSubmit={handleForgotPasswordSubmit} />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
