import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";

function App() {
  // 🔥 GLOBAL STATE (important for JobLens flow)
  const [resumeData, setResumeData] = useState(null);

  return (
    <Router>
      <div style={{ padding: "10px" }}>
        <h1>JobLens 🚀</h1>

        {/* NAVBAR */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <Link to="/upload">Upload</Link>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route path="/" element={<Home />} />

          {/* 🔥 Dashboard gets data */}
          <Route 
            path="/dashboard" 
            element={<Dashboard data={resumeData} />} 
          />

          {/* 🔥 Upload updates global state */}
          <Route 
            path="/upload" 
            element={<Upload setResumeData={setResumeData} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;