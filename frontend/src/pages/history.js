import { useEffect, useState } from "react";
import axios from "axios";

function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/history", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setData(res.data);
    };

    fetchHistory();
  }, []);

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h2>📜 Your History</h2>

      {data.map((item, i) => (
        <div key={i} style={styles.card}>
          <p>ATS Score: {item.ats_score}</p>
          <p>Skills: {item.skills}</p>
          <p>Date: {item.date}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    background: "#1e293b",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px"
  }
};

export default History;