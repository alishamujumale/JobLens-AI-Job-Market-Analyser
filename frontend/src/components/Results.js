function Results({ data }) {
  if (!data) return null;

  return (
    <div>
      <h2>Skills Found</h2>
      <p>{data.skills_found.join(", ")}</p>

      <h2>Job Recommendations</h2>

      {data.recommendations.map((job, index) => (
        <div key={index} style={{ border: "1px solid black", margin: 10 }}>
          <h3>{job.title}</h3>
          <p>Match: {job.match_score}%</p>
          <p>Matched: {job.matched_skills.join(", ")}</p>
          <p>Missing: {job.missing_skills.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}

export default Results;