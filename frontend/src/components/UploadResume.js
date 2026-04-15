import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UploadResume({ setResumeData }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();

  // 📌 Upload resume to backend
  const handleUpload = async () => {
    // ❌ validation
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

      // ✅ store data globally in App.js
      setResumeData(res.data);

      // 🚀 move user to dashboard automatically
      navigate("/dashboard");

    } catch (error) {
      console.log("Upload error:", error);
      alert("Resume upload failed. Check backend server.");
    } finally {
      setLoading(false);
    }
  };

  // 📌 Drag & Drop handlers
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

  return (
    <div style={styles.container}>
      <h2>📄 Upload Your Resume</h2>

      {/* 🔥 Drag & Drop Box */}
      <div
        style={{
          ...styles.dropzone,
          borderColor: dragActive ? "#00c853" : "#999",
          background: dragActive ? "#f0fff4" : "#fff",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <p>Drag & Drop your Resume here</p>
        <p>OR</p>

        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* 📌 File preview */}
      {file && (
        <p style={{ marginTop: "10px" }}>
          Selected File: <b>{file.name}</b>
        </p>
      )}

      {/* 🚀 Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          ...styles.button,
          background: loading ? "#888" : "#1976d2",
        }}
      >
        {loading ? "Analyzing Resume..." : "Analyze Resume 🚀"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
  },

  dropzone: {
    border: "2px dashed #999",
    borderRadius: "12px",
    padding: "40px",
    margin: "20px auto",
    width: "60%",
    cursor: "pointer",
    transition: "0.3s",
  },

  button: {
    marginTop: "20px",
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default UploadResume;