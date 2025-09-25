// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard_New";
import Profile from "./pages/Profile";
import PrivateRoute from "./routes/PrivateRoute";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Libros from "./pages/Libros";
import Escritores from "./pages/Escritores";
import Prestamos from "./pages/Prestamos";
import Users from "./pages/Users";
import Footer from "./components/Footer";
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/escritores"
            element={
              <PrivateRoute>
                <Escritores />
              </PrivateRoute>
            }
          />
          <Route
            path="/libros"
            element={
              <PrivateRoute>
                <Libros />
              </PrivateRoute>
            }
          />
          <Route
            path="/prestamos"
            element={
              <PrivateRoute>
                <Prestamos />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}