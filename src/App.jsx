import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
