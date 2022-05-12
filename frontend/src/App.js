import { Route, Routes, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "../src/Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Profile from "./Pages/Profile/Profile";
import Footer from "./components/Footer/Footer";
import Publication from "../src/Pages/Publications/Publications";
import AllPublication from "../src/Pages/Publications/AllPublications";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route path="home" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path="publication" element={<Publication />} />
        <Route path="articles" element={<AllPublication />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
