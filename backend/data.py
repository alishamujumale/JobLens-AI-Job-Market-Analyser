# backend/data.py

jobs = [
    {"title": "Data Scientist", "skills": ["python", "machine learning", "pandas"], "company": "ABC Tech"},
    {"title": "Backend Developer", "skills": ["python", "django", "sql"], "company": "XYZ Ltd"},
    {"title": "Frontend Developer", "skills": ["html", "css", "javascript", "react"], "company": "WebWorks"},
    {"title": "AI Engineer", "skills": ["python", "deep learning", "tensorflow"], "company": "AI Labs"}
]

def match_score(job, user_skills, preferred_role):
    score = 0
    
    for skill in job["skills"]:
        if skill in user_skills:
            score += 2
    
    if preferred_role in job["title"].lower():
        score += 3
    
    return score

def get_job_matches(user_skills, preferred_role):
    results = []
    
    for job in jobs:
        score = match_score(job, user_skills, preferred_role)
        if score > 0:
            results.append({"job": job, "score": score})
    
    results.sort(key=lambda x: x["score"], reverse=True)
    return results