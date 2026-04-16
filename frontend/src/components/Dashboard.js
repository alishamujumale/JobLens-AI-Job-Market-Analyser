import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ resumeData }) {
  const navigate = useNavigate();

  // ✅ ALWAYS at top (not conditional)
  useEffect(() => {
    if (!resumeData) {
      navigate("/upload");
    }
  }, [resumeData, navigate]);

  // AFTER hooks
  if (!resumeData) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
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
        <h2>Your Skills</h2>
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