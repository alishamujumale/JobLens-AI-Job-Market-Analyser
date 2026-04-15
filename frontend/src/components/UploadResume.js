import { useState } from "react";
import axios from "axios";

function UploadResume({ setResumeData }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    // ❌ validation
    if (!file) {
      alert("Please select a resume first!");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      // ✅ send data to global state (App.js)
      setResumeData(res.data);

      alert("Resume analyzed successfully 🚀");
    } catch (error) {
      console.log(error);
      alert("Upload failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Resume 📄</h2>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </div>
  );
}

export default UploadResume;