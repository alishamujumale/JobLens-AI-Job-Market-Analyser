def match_jobs(user_skills, jobs):
    results = []

    for job in jobs:
        required = job["skills"]

        matched = list(set(user_skills) & set(required))
        missing = list(set(required) - set(user_skills))

        score = int((len(matched) / len(required)) * 100)

        results.append({
            "title": job["title"],
            "match_score": score,
            "matched_skills": matched,
            "missing_skills": missing
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results