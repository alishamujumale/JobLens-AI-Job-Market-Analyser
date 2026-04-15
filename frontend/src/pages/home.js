import { useState } from "react";
import "../App.css";

function Home() {
  const [skills, setSkills] = useState("");
  const [role, setRole] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!skills || !role) {
      alert("Please enter both skills and role");
      return;
    }

    setLoading(true);

    try {
      const skillArray = skills
        .split(",")
        .map((s) => s.trim().toLowerCase());

      const response = await fetch("http://127.0.0.1:5000/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: skillArray,
          role: role,
        }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1 className="title">JobLens 🔍</h1>

      {/* Input Section */}
      <div className="input-box">
        <input
          type="text"
          placeholder="Enter skills (python, ml)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <input
          type="text"
          placeholder="Preferred role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {loading ? "Searching..." : "Find Jobs"}
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Loading jobs...</p>}

      {/* Results */}
      <div className="results">
        {results.length > 0 ? (
          results.map((item, index) => (
            <div key={index} className="card">
              <h2>{item.job.title}</h2>
              <p>{item.job.company}</p>

              <p className="score">Match Score: {item.score}</p>

              {/* Best Match Badge */}
              {index === 0 && (
                <p style={{ color: "#22c55e", fontWeight: "bold" }}>
                  ⭐ Best Match
                </p>
              )}
            </div>
          ))
        ) : (
          !loading && <p>No jobs found. Try different skills.</p>
        )}
      </div>
    </div>
  );
}

export default Home;