import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";

function App() {
  const [resumeData, setResumeData] = useState(null);

  return (
    <Router>
      <div style={styles.app}>

        {/* NAVBAR */}
        <nav style={styles.navbar}>
          <div style={styles.navContainer}>
            <h1 style={styles.logo}>JobLens 🔍</h1>

            <div style={styles.navLinks}>
              
              <NavLink 
                to="/" 
                style={({ isActive }) => ({
                  ...styles.link,
                  backgroundColor: isActive ? "#3b82f6" : "transparent"
                })}
              >
                Home
              </NavLink>

              <NavLink 
                to="/upload" 
                style={({ isActive }) => ({
                  ...styles.link,
                  backgroundColor: isActive ? "#3b82f6" : "transparent"
                })}
              >
                Upload
              </NavLink>

              <NavLink 
                to="/dashboard" 
                style={({ isActive }) => ({
                  ...styles.link,
                  backgroundColor: isActive ? "#3b82f6" : "transparent"
                })}
              >
                Dashboard
              </NavLink>

            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div style={styles.content}>
          <Routes>
            
            {/* HOME */}
            <Route path="/" element={<Home />} />

            {/* UPLOAD */}
            <Route 
              path="/upload" 
              element={<Upload setResumeData={setResumeData} />} 
            />

            {/* DASHBOARD (PROTECTED) */}
            <Route 
              path="/dashboard" 
              element={
                resumeData ? (
                  <Dashboard resumeData={resumeData} />
                ) : (
                  <div style={styles.noData}>
                    <h2>No Resume Uploaded</h2>
                    <p>Please upload your resume first.</p>
                  </div>
                )
              } 
            />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

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
    padding: "0",
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
    gap: "20px",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    padding: "8px 14px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
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
};

export default App;