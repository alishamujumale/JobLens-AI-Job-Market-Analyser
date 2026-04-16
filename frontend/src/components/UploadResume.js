import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadResume({ setResumeData }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // ----------------------------
  // HANDLE UPLOAD
  // ----------------------------
  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a resume first!");
      return;
    }

    // File type validation
    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
      alert("Only PDF or DOCX files are allowed!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Backend Response:", res.data);

      // Store response globally
      setResumeData(res.data);

      // Navigate to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.log("Upload error:", error);

      if (error.response) {
        alert(error.response.data.error || "Upload failed");
      } else {
        alert("Server not running or network issue");
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // DRAG & DROP HANDLERS
  // ----------------------------
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  // Open file picker
  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔍 JobLens</h1>
      <h3 style={styles.subtitle}>Upload Your Resume for AI Analysis</h3>

      {/* DROP ZONE */}
      <div
        style={{
          ...styles.dropzone,
          borderColor: dragActive ? "#10b981" : "#3b82f6",
          background: dragActive ? "rgba(59,130,246,0.1)" : "#0f172a",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleDropzoneClick}
      >
        <p style={styles.dragText}>Drag & Drop your Resume here</p>
        <p style={styles.orText}>OR</p>
        <p style={styles.clickText}>Click to Choose File</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />
      </div>

      {/* FILE PREVIEW */}
      {file && (
        <div style={styles.filePreview}>
          <p>
            Selected File: <b>{file.name}</b>
          </p>
          <p style={styles.fileSize}>
            ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        </div>
      )}

      {/* BUTTON */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
  <button
    onClick={handleUpload}
    disabled={loading || !file}
    style={{
      ...styles.button,
      background: loading ? "#888" : !file ? "#475569" : "#3b82f6",
      cursor: loading || !file ? "not-allowed" : "pointer",
    }}
  >
    {loading ? "Analyzing Resume..." : "Analyze Resume"}
  </button>
</div>
    </div>
  );
} 


// ----------------------------
// STYLES
// ----------------------------
const styles = {
  container: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#020617",
    minHeight: "100vh",
    color: "white",
  },

  title: {
    fontSize: "36px",
    color: "#38bdf8",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: "30px",
  },

  dropzone: {
    border: "3px dashed #3b82f6",
    borderRadius: "12px",
    padding: "60px 30px",
    margin: "30px auto",
    width: "100%",
    maxWidth: "500px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  dragText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#60a5fa",
  },

  orText: {
    fontSize: "14px",
    color: "#64748b",
    margin: "10px 0",
  },

  clickText: {
    fontSize: "14px",
    color: "#94a3b8",
    textDecoration: "underline",
  },

  filePreview: {
    background: "rgba(16,185,129,0.1)",
    border: "1px solid #10b981",
    borderRadius: "8px",
    padding: "15px",
    marginTop: "20px",
    display: "inline-block",
    color: "#10b981",
  },

  fileSize: {
    fontSize: "12px",
    color: "#6ee7b7",
  },

  button: {
    marginTop: "30px",
    padding: "14px 40px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    border: "none",
    borderRadius: "8px",
    transition: "0.3s",
    textAlign: "center",
  },
};

export default UploadResume;