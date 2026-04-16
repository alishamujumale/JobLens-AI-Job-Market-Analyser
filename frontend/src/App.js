import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";
import Login from "./pages/login";
import Register from "./pages/register";
import History from "./pages/history";
import ProtectedRoute from "./components/ProtectedRoute";
const isLoggedIn = !!localStorage.getItem("token");
const username = localStorage.getItem("username");

function App() {
  const [resumeData, setResumeData] = useState(
  JSON.parse(localStorage.getItem("resumeData"))
);

  return (
    <Router>
      <div style={styles.app}>

        {/* NAVBAR */}
        <nav style={styles.navbar}>
          <div style={styles.navContainer}>
            <h1 style={styles.logo}>JobLens 🔍</h1>

            <div style={styles.navLinks}>

              <NavLink to="/" style={navStyle}>Home</NavLink>
              <NavLink to="/upload" style={navStyle}>Upload</NavLink>
              <NavLink to="/dashboard" style={navStyle}>Dashboard</NavLink>
              <NavLink to="/history" style={navStyle}>History</NavLink>
              <NavLink to="/login" style={navStyle}>Login</NavLink>
              <NavLink to="/register" style={navStyle}>Register</NavLink>

              <div style={styles.navLinks}>
                {isLoggedIn && (
                  <span style={styles.username}>
                     {username}
                  </span>
                )}</div>

              {/* LOGOUT BUTTON */}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                style={styles.logoutBtn}
              >
                Logout
              </button>

            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div style={styles.content}>
          <Routes>

            <Route path="/" element={<Home />} />

            <Route
              path="/upload"
              element={<Upload setResumeData={setResumeData} />}
            />

            {/* PROTECTED DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {resumeData ? (
                    <Dashboard resumeData={resumeData} />
                  ) : (
                    <div style={styles.noData}>
                      <h2>No Resume Uploaded</h2>
                      <p>Please upload your resume first.</p>
                    </div>
                  )}
                </ProtectedRoute>
              }
            />

            {/* PROTECTED HISTORY */}
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

const navStyle = ({ isActive }) => ({
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "500",
  padding: "8px 14px",
  borderRadius: "6px",
  backgroundColor: isActive ? "#3b82f6" : "transparent",
  transition: "all 0.3s ease",
});


// ----------------------------
// STYLES
// ----------------------------
const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "white",
  },

  navbar: {
    background: "#1e293b",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderBottom: "2px solid #3b82f6",
  },

  navContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
  },

  logo: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
    color: "#60a5fa",
  },

  navLinks: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },

  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },

  noData: {
    textAlign: "center",
    marginTop: "100px",
    color: "#94a3b8",
  },

  logoutBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  username: {
  color: "#60a5fa",
  fontWeight: "bold",
  marginRight: "10px",
},
};

export default App;