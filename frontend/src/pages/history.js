import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          return;
        }

const res = await axios.get("http://localhost:5000/history", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

        setData(res.data.history);  // ✅ res is defined here

      } catch (err) {
        console.log(err);
        alert("Error fetching history / Session expired");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h2>📜 Your History</h2>

      {data.length === 0 ? (
        <p>No history found</p>
      ) : (
        data.map((item, i) => (
          <div key={i} style={styles.card}>
            <p><b>ATS Score:</b> {item.ats_score}</p>
            <p><b>Readiness:</b> {item.readiness_score}%</p>
            <p><b>Status:</b> {item.overall_status?.status || "N/A"}</p>
            <p><b>Skills:</b> {Array.isArray(item.skills) ? item.skills.join(", ") : item.skills}</p>
            <p><b>Missing Skills:</b> {Array.isArray(item.missing_skills) ? item.missing_skills.join(", ") : item.missing_skills}</p>
            <p><b>Suggestions:</b></p>
            <ul style={styles.suggestionsList}>
              {Array.isArray(item.suggestions) && item.suggestions.length > 0 ? (
                item.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))
              ) : (
                <li>No suggestions recorded.</li>
              )}
            </ul>
            <p><b>Date:</b> {item.date}</p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#1e293b",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #3b82f6",
  },
  suggestionsList: {
    marginTop: "10px",
    paddingLeft: "20px",
    color: "#cbd5e1",
  },
};

export default History;