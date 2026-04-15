import { useState } from "react";
import "../App.css";

function Home() {
  const [skills, setSkills] = useState("");
  const [role, setRole] = useState("");
  const [results, setResults] = useState([]);

  const handleSubmit = async () => {
    const skillArray = skills.split(",").map(s => s.trim().toLowerCase());

    const response = await fetch("http://127.0.0.1:5000/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        skills: skillArray,
        role: role
      })
    });

    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="container">
      <h1 className="title">JobLens 🔍</h1>

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

        <button onClick={handleSubmit}>Find Jobs</button>
      </div>

      <div className="results">
        {results.map((item, index) => (
          <div key={index} className="card">
            <h2>{item.job.title}</h2>
            <p>{item.job.company}</p>
            <p className="score">Match Score: {item.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;