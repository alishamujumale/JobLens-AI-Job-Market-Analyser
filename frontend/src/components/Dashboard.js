function Dashboard({ data }) {
  if (!data) {
    return <h2>No resume uploaded yet</h2>;
  }

  return (
    <div>
      <h2>Recommended Jobs 🚀</h2>

      {data.recommendations.map((job, index) => (
        <div key={index} style={{ border: "1px solid gray", margin: 10 }}>
          <h3>{job.title}</h3>
          <p>Match: {job.match_score}%</p>
          <p>Matched Skills: {job.matched_skills.join(", ")}</p>
          <p>Missing Skills: {job.missing_skills.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;