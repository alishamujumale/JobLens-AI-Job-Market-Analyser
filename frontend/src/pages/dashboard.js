import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Dashboard({ resumeData }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!resumeData) {
      navigate("/upload");
    }
  }, [resumeData, navigate]);

  // Redirect if no data
  if (!resumeData) {
    return <div>Loading...</div>;
  }

  const { 
    skills_found, 
    missing_skills,
    suggestions,
    recommendations, 
    skills_gap, 
    interview_insights, 
    overall_status 
  } = resumeData;

const top5Jobs = recommendations.slice(0, 5);

  return (
    <div style={styles.dashboard}>
      {/* TAB NAVIGATION */}
      <div style={styles.tabNav}>
        <button
          style={{
            ...styles.tabBtn,
            background: activeTab === "overview" ? "#1976d2" : "#f0f0f0",
            color: activeTab === "overview" ? "white" : "black",
          }}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          style={{
            ...styles.tabBtn,
            background: activeTab === "matches" ? "#1976d2" : "#f0f0f0",
            color: activeTab === "matches" ? "white" : "black",
          }}
          onClick={() => setActiveTab("matches")}
        >
          Job Matches
        </button>
        <button
          style={{
            ...styles.tabBtn,
            background: activeTab === "gap" ? "#1976d2" : "#f0f0f0",
            color: activeTab === "gap" ? "white" : "black",
          }}
          onClick={() => setActiveTab("gap")}
        >
          Skills Gap
        </button>
        <button
          style={{
            ...styles.tabBtn,
            background: activeTab === "interview" ? "#1976d2" : "#f0f0f0",
            color: activeTab === "interview" ? "white" : "black",
          }}
          onClick={() => setActiveTab("interview")}
        >
          Interview Tips
        </button>
      </div>

      {/* TAB CONTENT */}
      <div style={styles.tabContent}>
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === "overview" && (
          <div>
            <div style={styles.statusCard}>
              <h2>Job Market Readiness</h2>
              <div style={styles.statusBadge}>
                <div style={styles.statusValue}>{overall_status.readiness_score}%</div>
                <div style={styles.statusText}>{overall_status.status}</div>
              </div>
              <p style={styles.statusMessage}>{overall_status?.message || overall_status?.status}</p>
            </div>

            {/* SKILLS FOUND */}
            <div style={styles.card}>
              <h3>Your Skills ({skills_found.length})</h3>
              <div style={styles.skillsList}>
                {skills_found.length > 0 ? (
                  skills_found.map((skill, idx) => (
                    <span key={idx} style={styles.skillBadge}>
                      {skill}
                    </span>
                  ))
                ) : (
                  <p>No skills detected. Try uploading a resume!</p>
                )}
              </div>
            </div>

            {/* SUGGESTIONS */}
            <div style={styles.card}>
              <h3>Resume Suggestions</h3>
              {suggestions && suggestions.length > 0 ? (
                <ul style={styles.suggestionsList}>
                  {suggestions.map((suggestion, idx) => (
                    <li key={idx} style={styles.suggestionItem}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No suggestions available yet.</p>
              )}
            </div>

            {/* MISSING SKILLS */}
            {missing_skills && missing_skills.length > 0 && (
              <div style={styles.card}>
                <h3>Missing High-Value Skills</h3>
                <div style={styles.skillsList}>
                  {missing_skills.slice(0, 10).map((skill, idx) => (
                    <span key={idx} style={styles.missingBadge}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* TOP JOB MATCH */}
            {recommendations.length > 0 && (
              <div style={styles.topMatchCard}>
                <h3>Your Best Match</h3>
                <div style={styles.topMatch}>
                  <div style={styles.matchTitle}>{recommendations[0].title}</div>
                  <div style={styles.matchScore}>
                    {recommendations[0].match_score}% Match
                  </div>
                  <p>Matched Skills: {recommendations[0].matched_skills.join(", ")}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== MATCHES TAB ===== */}
        {activeTab === "matches" && (
          <div>
            <h2>Job Recommendations</h2>
            <div style={styles.jobsList}>
              {top5Jobs.map((job, idx) => (
                <div key={idx} style={styles.jobCard}>
                  <div style={styles.jobHeader}>
                    <h3>{job.title}</h3>
                    <span style={{
                      ...styles.matchBadge,
                      background: job.match_score >= 80 ? "#4caf50" : 
                                job.match_score >= 60 ? "#ff9800" : "#f44336"
                    }}>
                      {job.match_score}%
                    </span>
                  </div>
                  <div style={styles.jobContent}>
                    <p><strong>Matched:</strong> {job.matched_skills.join(", ") || "None"}</p>
                    <p><strong>Missing:</strong> {job.missing_skills.join(", ") || "None"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== SKILLS GAP TAB ===== */}
        {activeTab === "gap" && (
          <div>
            <h2>Skills Gap Analysis</h2>
            <p style={{ marginBottom: "20px" }}>
              These are the most wanted skills across your recommended jobs
            </p>
            <div style={styles.gapList}>
              {skills_gap.length > 0 ? (
                skills_gap.map((gap, idx) => (
                  <div key={idx} style={styles.gapItem}>
                    <div style={styles.gapHeader}>
                      <h4>{gap.skill}</h4>
                      <span style={styles.gapBadge}>{gap.frequency} jobs</span>
                    </div>
                    <p style={styles.gapJobs}>
                      Required for: {gap.required_for.join(", ")}
                    </p>
                  </div>
                ))
              ) : (
                <p>No significant gaps - you're well-skilled!</p>
              )}
            </div>
          </div>
        )}

        {/* ===== INTERVIEW TIPS TAB ===== */}
        {activeTab === "interview" && (
          <div>
            <h2>Interview Preparation</h2>
            <div style={styles.interviewList}>
              {interview_insights.length > 0 ? (
                interview_insights.map((insight, idx) => (
                  <div key={idx} style={styles.interviewCard}>
                  <div style={styles.interviewHeader}>
                    <h3>{insight.job_title}</h3>
                    <span style={{...styles.matchBadge, background: "#1976d2"}}>
                      {insight.match_score}%
                    </span>
                    </div>
                    <ul style={styles.tipsList}>
                      {insight.tips.map((tip, tipIdx) => (
                        <li key={tipIdx} style={styles.tip}>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>Upload a resume to get interview tips!</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={styles.actionArea}>
        <button
          onClick={() => navigate("/upload")}
          style={styles.actionBtn}
        >
          Upload New Resume
        </button>
      </div>
    </div>
  );
}

const styles = {
  dashboard: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "white",
  },
  title: {
    textAlign: "center",
    color: "#60a5fa",
    marginBottom: "30px",
  },
  tabNav: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  tabBtn: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "0.3s",
  },
  tabContent: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    minHeight: "400px",
    color: "white",
  },
  statusCard: {
    background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
    color: "white",
    padding: "30px",
    borderRadius: "12px",
    marginBottom: "30px",
    textAlign: "center",
  },
  statusBadge: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  statusValue: {
    fontSize: "48px",
    fontWeight: "bold",
    margin: "10px 0",
  },
  statusText: {
    fontSize: "20px",
    marginTop: "10px",
  },
  statusMessage: {
    fontSize: "16px",
    marginTop: "15px",
    fontStyle: "italic",
  },
  card: {
    background: "#0f172a",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #334155",
  },
  skillsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "15px",
  },
  skillBadge: {
    background: "#10b981",
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  topMatchCard: {
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    color: "white",
    padding: "25px",
    borderRadius: "8px",
    marginTop: "20px",
  },
  topMatch: {
    marginTop: "15px",
  },
  matchTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  matchScore: {
    fontSize: "20px",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  jobsList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  jobCard: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "8px",
    padding: "20px",
  },
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  jobContent: {
    lineHeight: "1.6",
    color: "#cbd5e1",
  },
  matchBadge: {
    padding: "8px 12px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
  },
  gapList: {
    marginTop: "20px",
  },
  gapItem: {
    background: "#0f172a",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
    borderLeft: "4px solid #f59e0b",
    border: "1px solid #334155",
  },
  gapHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  gapBadge: {
    background: "#f59e0b",
    color: "white",
    padding: "5px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  gapJobs: {
    margin: "10px 0 0 0",
    color: "#94a3b8",
    fontSize: "14px",
  },
  interviewList: {
    marginTop: "20px",
  },
  interviewCard: {
    background: "#0f172a",
    border: "2px solid #3b82f6",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
  },
  interviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "2px solid #3b82f6",
  },
  tipsList: {
    listStyle: "none",
    padding: 0,
    margin: "10px 0 0 0",
  },
  tip: {
    padding: "10px 0 10px 20px",
    borderLeft: "3px solid #10b981",
    marginBottom: "10px",
    lineHeight: "1.6",
    color: "#cbd5e1",
  },
  actionArea: {
    textAlign: "center",
    marginTop: "30px",
  },
  actionBtn: {
    padding: "12px 30px",
    fontSize: "16px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },
  suggestionsList: {
    listStyle: "disc inside",
    textAlign: "left",
    marginTop: "10px",
    color: "#cbd5e1",
  },
  suggestionItem: {
    marginBottom: "8px",
    lineHeight: 1.6,
  },
  missingBadge: {
    display: "inline-block",
    background: "#ef4444",
    color: "white",
    padding: "6px 10px",
    borderRadius: "999px",
    margin: "4px 6px 4px 0",
    fontSize: "12px",
  },
};

export default Dashboard;