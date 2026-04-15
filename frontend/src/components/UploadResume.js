import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadResume({ setResumeData }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload a resume first!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResumeData(res.data);
      navigate("/dashboard");

    } catch (error) {
      console.log("Upload error:", error);
      alert("Resume upload failed. Check backend server.");
    } finally {
      setLoading(false);
    }
  };
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

  // Handle dropzone click to open file picker
  const handleDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={styles.container}>
      <h3 style={{ marginBottom: "20px", color: "#60a5fa" }}>Upload Your Resume</h3>

      <div
        style={{
          ...styles.dropzone,
          borderColor: dragActive ? "#10b981" : "#3b82f6",
          background: dragActive ? "rgba(59, 130, 246, 0.1)" : "#0f172a",
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

      {file && (
        <div style={styles.filePreview}>
          <p>Selected File: <b>{file.name}</b></p>
          <p style={styles.fileSize}>({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        style={{
          ...styles.button,
          background: loading ? "#888" : !file ? "#ccc" : "#1976d2",
          cursor: loading || !file ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Analyzing Resume..." : "Analyze Resume"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px 20px",
    maxWidth: "600px",
    margin: "0 auto",
  },

  dropzone: {
    border: "3px dashed #3b82f6",
    borderRadius: "12px",
    padding: "60px 30px",
    margin: "30px auto",
    width: "100%",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },

  dragText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#60a5fa",
    margin: "10px 0",
  },

  orText: {
    fontSize: "14px",
    color: "#64748b",
    margin: "15px 0",
  },

  clickText: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: "10px 0",
    textDecoration: "underline",
  },

  filePreview: {
    background: "rgba(16, 185, 129, 0.1)",
    border: "1px solid #10b981",
    borderRadius: "8px",
    padding: "15px",
    marginTop: "20px",
    color: "#10b981",
  },

  fileSize: {
    fontSize: "12px",
    margin: "5px 0 0 0",
    color: "#6ee7b7",
  },

  button: {
    marginTop: "25px",
    padding: "14px 35px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    border: "none",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)",
    background: "#3b82f6",
    cursor: "pointer",
  },
};

export default UploadResume;
