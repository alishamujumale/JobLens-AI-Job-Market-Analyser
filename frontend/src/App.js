import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";

function App() {
  return (
    <Router>
      <h1>JobLens 🚀</h1>

      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link> |{" "}
        <Link to="/upload">Upload</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
  );
}

export default App;