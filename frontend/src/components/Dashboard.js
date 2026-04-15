function Dashboard({ data }) {
  if (!data) {
    return <h2>No resume uploaded yet 📄</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 AI Career Dashboard</h2>

      {/* 🔥 AI SCORE */}
      <div style={styles.card}>
        <h3>Job Readiness Score</h3>
        <h1>{data.job_readiness}%</h1>

        <p>
          {data.job_readiness > 70
            ? "🔥 You are job ready!"
            : "📚 You need more skills"}
        </p>
      </div>

      {/* SKILLS */}
      <div style={styles.card}>
        <h3>Skills Found</h3>
        <p>{data.skills_found.join(", ")}</p>
      </div>

      {/* JOBS */}
      <h3>Recommended Jobs 🚀</h3>

      {data.recommendations.map((job, i) => (
        <div key={i} style={styles.jobCard}>
          <h3>{job.title}</h3>
          <p>Match: {job.match_score}%</p>

          <p>Matched: {job.matched_skills.join(", ")}</p>

          <p style={{ color: "red" }}>
            Missing: {job.missing_skills.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "10px",
  },
  jobCard: {
    border: "1px solid black",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "10px",
  },
};

export default Dashboard;