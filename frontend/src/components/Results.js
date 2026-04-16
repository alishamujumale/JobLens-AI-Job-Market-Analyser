function Results({ data }) {
  if (!data) return null;

  return (
    <div>
      <h2>Jobs</h2>

      {data.recommendations.map((job, i) => (
        <div key={i}>
          <h3>{job.title}</h3>
          <p>{job.match_score}%</p>
        </div>
      ))}
    </div>
  );
}

export default Results;