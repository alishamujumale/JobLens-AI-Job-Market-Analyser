import React from "react";

function Dashboard({ resumeData }) {
  if (!resumeData) {
    return <h2 style={{ textAlign: "center" }}>No Data Found</h2>;
  }

  const {
    ats_score,
    skills_found,
    missing_skills,
    recommendations,
    suggestions,
    overall_status,
  } = resumeData;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Resume Analysis Dashboard</h1>

      {/* ATS SCORE */}
      <div style={styles.card}>
        <h2>ATS Score</h2>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${ats_score}%`,
              background:
                ats_score > 75 ? "#22c55e" :
                ats_score > 50 ? "#facc15" : "#ef4444",
            }}
          ></div>
        </div>
        <p style={styles.scoreText}>{ats_score}/100</p>
      </div>

      {/* SKILLS FOUND */}
      <div style={styles.card}>
        <h2>Skills Found</h2>
        <div style={styles.tagContainer}>
          {skills_found?.map((skill, i) => (
            <span key={i} style={styles.skillTag}>{skill}</span>
          ))}
        </div>
      </div>

      {/* MISSING SKILLS */}
      <div style={styles.card}>
        <h2>Missing Skills</h2>
        <div style={styles.tagContainer}>
          {missing_skills?.map((skill, i) => (
            <span key={i} style={styles.missingTag}>{skill}</span>
          ))}
        </div>
      </div>

      {/* JOB MATCHING */}
      <div style={styles.card}>
        <h2>💼 Job Recommendations</h2>
        {recommendations?.map((job, i) => (
          <div key={i} style={styles.jobCard}>
            <h3>{job.role}</h3>
            <p>Match: {job.match}%</p>
          </div>
        ))}
      </div>

      {/* SUGGESTIONS */}
      <div style={styles.card}>
        <h2>💡 Suggestions</h2>
        <ul>
          {suggestions?.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* OVERALL STATUS */}
      <div style={styles.card}>
        <h2>📌 Overall Status</h2>
        <p style={styles.status}>{overall_status}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#38bdf8",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
  },

  progressBar: {
    width: "100%",
    height: "20px",
    background: "#334155",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "10px",
  },

  progressFill: {
    height: "100%",
    transition: "width 0.5s ease",
  },

  scoreText: {
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "bold",
  },

  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "10px",
  },

  skillTag: {
    background: "#22c55e",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
  },

  missingTag: {
    background: "#ef4444",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
  },

  jobCard: {
    background: "#334155",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
  },

  status: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#facc15",
  },
};

export default Dashboard;