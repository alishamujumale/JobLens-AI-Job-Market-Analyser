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
      alert("Something went wrong! Check if backend is running.");
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

  // ================= RESULTS PAGE =================
  if (results) {
    return (
      <div className="container">

        {/* STATUS CARD */}
        <div style={styles.statusCard}>
          <h2>Match Analysis</h2>

          <div style={styles.statusGrid}>
            <div>
              <div style={styles.bigNumber}>
                {results.overall_status.readiness_score}%
              </div>
              <div style={styles.label}>Readiness Score</div>
            </div>

            <div>
              <div style={styles.bigNumber}>
                {results.recommendations.length}
              </div>
              <div style={styles.label}>Matching Jobs</div>
            </div>

            <div>
              <div style={styles.bigNumber}>
                {results.skills_gap.length}
              </div>
              <div style={styles.label}>Skills to Learn</div>
            </div>
          </div>

          <p style={styles.statusMessage}>
            {results.overall_status.message}
          </p>
        </div>

        {/* TOP JOB MATCHES */}
        <h2 style={styles.sectionTitle}>Top Job Matches</h2>

        <div className="results">
          {results.recommendations.slice(0, 5).map((item, index) => (
            <div key={index} className="card" style={styles.jobCard}>

              <div style={styles.cardHeader}>
                <h3>{item.title}</h3>

                <span
                  style={{
                    ...styles.scoreBadge,
                    background:
                      item.match_score >= 80
                        ? "#10b981"
                        : item.match_score >= 60
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                >
                  {item.match_score}%
                </span>
              </div>

              {index === 0 && (
                <p style={styles.bestMatch}>Best Match</p>
              )}

              <p>
                <strong>Your Skills:</strong>{" "}
                {item.matched_skills.length}/
                {item.matched_skills.length +
                  item.missing_skills.length}
              </p>

              <p style={styles.matchedSkills}>
                {item.matched_skills.join(", ")}
              </p>

              {item.missing_skills.length > 0 && (
                <>
                  <p><strong>Missing:</strong></p>
                  <p style={styles.missingSkills}>
                    {item.missing_skills.join(", ")}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>

        {/* SKILL GAP */}
        {results.skills_gap.length > 0 && (
          <>
            <h2 style={styles.sectionTitle}>Skills to Learn</h2>

            <div style={styles.gapContainer}>
              {results.skills_gap.slice(0, 5).map((gap, index) => (
                <div key={index} style={styles.gapCard}>
                  <div style={styles.gapTitle}>{gap.skill}</div>
                  <p style={styles.gapInfo}>
                    Needed for {gap.frequency} job(s)
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={styles.center}>
          <button
            onClick={() => {
              setResults(null);
              setSkills("");
              setRole("");
            }}
            style={styles.backBtn}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ================= LANDING PAGE =================
  return (
    <div style={styles.pageWrapper}>
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Welcome to <span style={styles.highlight}>JobLens</span>
        </h1>

        <p style={styles.heroSubtitle}>
          AI-powered career assistant that analyzes your resume,
          identifies skill gaps, and matches you with the best jobs.
        </p>

        <button
          onClick={() => navigate("/upload")}
          style={styles.heroBtn}
        >
          Upload Resume
        </button>

        <div style={styles.cardSection}>
          <div style={styles.featureCard}>
            <h3 style={styles.cardTitle}>Resume Analysis</h3>
            <p>AI extracts skills from your resume</p>
          </div>

          <div style={styles.featureCard}>
            <h3 style={styles.cardTitle}>Job Matching</h3>
            <p>Find jobs matching your profile</p>
          </div>

          <div style={styles.featureCard}>
            <h3 style={styles.cardTitle}>Skill Guidance</h3>
            <p>Learn what to improve</p>
          </div>
        </div>
      </section>

      <section style={styles.quickMatchSection}>
        <h2 style={styles.sectionTitle}>Quick Job Matching</h2>

        <div className="input-box">
          <input
            type="text"
            placeholder="Enter skills (python, react, sql)"
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
      </section>
    </div>
  );
}

export default Home;

// ================= STYLES =================
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },

  loadingText: {
    textAlign: "center",
    marginTop: "50px",
    color: "#94a3b8",
  },

  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#0f172a",
  },

  hero: {
    textAlign: "center",
    padding: "80px 20px",
  },

  heroTitle: {
    fontSize: "50px",
    color: "white",
  },

  highlight: {
    color: "#60a5fa",
  },

  heroSubtitle: {
    color: "#cbd5e1",
    maxWidth: "600px",
    margin: "20px auto",
  },

  heroBtn: {
    padding: "12px 30px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },

  cardSection: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "40px",
    flexWrap: "wrap",
  },

  featureCard: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    width: "220px",
    color: "white",
  },

  cardTitle: {
    color: "#60a5fa",
  },

  quickMatchSection: {
    padding: "60px 20px",
    textAlign: "center",
  },

  sectionTitle: {
    textAlign: "center",
    color: "#60a5fa",
    marginTop: "30px",
  },

  statusCard: {
    background: "#1e3a8a",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    marginTop: "20px",
  },

  bigNumber: {
    fontSize: "30px",
    fontWeight: "bold",
  },

  label: {
    fontSize: "12px",
  },

  statusMessage: {
    marginTop: "15px",
    fontStyle: "italic",
  },

  jobCard: {
    padding: "15px",
    margin: "10px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
  },

  scoreBadge: {
    padding: "5px 10px",
    borderRadius: "10px",
    color: "white",
  },

  bestMatch: {
    color: "#10b981",
    fontWeight: "bold",
  },

  matchedSkills: {
    fontSize: "13px",
    color: "#cbd5e1",
  },

  missingSkills: {
    fontSize: "13px",
    color: "#f87171",
  },

  gapContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: "10px",
    padding: "20px",
  },

  gapCard: {
    background: "#0f172a",
    border: "1px solid #3b82f6",
    padding: "10px",
    borderRadius: "8px",
  },

  gapTitle: {
    color: "#60a5fa",
  },

  gapInfo: {
    fontSize: "12px",
    color: "#cbd5e1",
  },

  center: {
    textAlign: "center",
    marginTop: "30px",
  },

  backBtn: {
    padding: "10px 20px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
};