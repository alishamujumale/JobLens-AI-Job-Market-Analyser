import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";

function App() {
  const [resumeData, setResumeData] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <Router>
      <div style={styles.app}>
        {/* NAVBAR */}
        <nav style={styles.navbar}>
          <div style={styles.navContainer}>
            <h1 style={styles.logo}>JobLens 🔍</h1>
            <div style={styles.navLinks}>
              <Link 
                to="/" 
                style={{
                  ...styles.link,
                  backgroundColor: hoveredLink === "home" ? "rgba(255,255,255,0.2)" : "transparent"
                }}
                onMouseEnter={() => setHoveredLink("home")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Home
              </Link>
              <Link 
                to="/upload" 
                style={{
                  ...styles.link,
                  backgroundColor: hoveredLink === "upload" ? "rgba(255,255,255,0.2)" : "transparent"
                }}
                onMouseEnter={() => setHoveredLink("upload")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Upload
              </Link>
              <Link 
                to="/dashboard" 
                style={{
                  ...styles.link,
                  backgroundColor: hoveredLink === "dashboard" ? "rgba(255,255,255,0.2)" : "transparent"
                }}
                onMouseEnter={() => setHoveredLink("dashboard")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload setResumeData={setResumeData} />} />
            <Route path="/dashboard" element={<Dashboard data={resumeData} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
  },
  navbar: {
    background: "#1e293b",
    color: "white",
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
    gap: "25px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "500",
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
};

export default App;