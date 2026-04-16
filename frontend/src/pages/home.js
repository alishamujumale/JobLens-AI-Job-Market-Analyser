import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const [skills, setSkills] = useState("");
  const [role, setRole] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      const response = await fetch("http://localhost:5000/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: skillArray, role }),
      });

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      alert("Backend error");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      {/* ================= LANDING ================= */}
      {!results && (
        <>
          <section style={styles.hero}>
            <h1 style={styles.heroTitle}>
              Welcome to <span style={styles.highlight}>JobLens 🔍</span>
            </h1>

            <p style={styles.heroSubtitle}>
              AI-powered job matcher + resume analyzer
            </p>

            <button
              onClick={() => navigate("/upload")}
              style={styles.heroBtn}
            >
              Upload Resume
            </button>
          </section>

          <section style={styles.quickMatchSection}>
            <h2 style={styles.sectionTitle}>Quick Match</h2>

            <input
              placeholder="Skills (python, react, sql)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              style={styles.input}
            />

            <input
              placeholder="Role (Frontend Developer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
            />

            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <button onClick={handleSubmit} style={styles.heroBtn}>
                Find Jobs
              </button>
            </div>
          </section>
        </>
      )}

      {/* ================= RESULTS ================= */}
      {results && (
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Match Analysis</h2>

          {/* STATUS */}
          <div style={styles.statusCard}>
            <h3>Readiness Score</h3>
            <h1>{results.overall_status.readiness_score}%</h1>
            <p>{results.overall_status.message}</p>
          </div>

          {/* JOBS */}
          <h2>Top Jobs</h2>

          {results.recommendations.slice(0, 5).map((job, i) => (
            <div key={i} style={styles.jobCard}>
              <h3>{job.title}</h3>
              <p>Match: {job.match_score}%</p>
              <p>Matched: {job.matched_skills.join(", ")}</p>
              <p style={{ color: "red" }}>
                Missing: {job.missing_skills.join(", ")}
              </p>
            </div>
          ))}

          {/* SKILL GAP */}
          <h2>Skill Gap</h2>

          {results.skills_gap.map((g, i) => (
            <div key={i} style={styles.gapCard}>
              {g.skill} ({g.frequency} jobs)
            </div>
          ))}

          {/* ================= AI RESUME ================= */}
          {results.generated_resume && (
            <div style={styles.resumeCard}>
              <h2>📄 AI Generated Resume</h2>

              <p>
                <strong>Role:</strong>{" "}
                {results.generated_resume.role}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {results.generated_resume.skills.join(", ")}
              </p>

              <h3>Projects</h3>

              {results.generated_resume.projects.map((p, i) => (
                <div key={i} style={styles.projectBox}>
                  {p}
                </div>
              ))}

              <h3>Summary</h3>
              <p>{results.generated_resume.summary}</p>
            </div>
          )}

          <button
            onClick={() => {
              setResults(null);
              setSkills("");
              setRole("");
            }}
            style={styles.heroBtn}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },

  container: {
    maxWidth: "900px",
    margin: "auto",
  },

  hero: {
    textAlign: "center",
    padding: "60px",
  },

  heroTitle: {
    fontSize: "40px",
  },

  highlight: {
    color: "#38bdf8",
  },

  heroSubtitle: {
    color: "#94a3b8",
  },

  heroBtn: {
    padding: "10px 20px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    marginTop: "20px",
    cursor: "pointer",
    borderRadius: "8px",
  },

  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    width: "300px",
  },

  sectionTitle: {
    color: "#38bdf8",
    marginTop: "30px",
  },

  statusCard: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  jobCard: {
    background: "#1e293b",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
  },

  gapCard: {
    background: "#0f172a",
    border: "1px solid #3b82f6",
    padding: "10px",
    margin: "5px",
  },

  resumeCard: {
    background: "#111827",
    padding: "20px",
    marginTop: "30px",
    borderRadius: "10px",
    border: "1px solid #334155",
  },

  projectBox: {
    background: "#0f172a",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #3b82f6",
  },
};