# backend/data.py

jobs = [
    {"title": "Data Scientist", "skills": ["python", "machine learning", "pandas"], "company": "ABC Tech"},
    {"title": "Backend Developer", "skills": ["python", "django", "sql"], "company": "XYZ Ltd"},
    {"title": "Frontend Developer", "skills": ["html", "css", "javascript", "react"], "company": "WebWorks"},
    {"title": "AI Engineer", "skills": ["python", "deep learning", "tensorflow"], "company": "AI Labs"}
]

def match_score(job, user_skills, preferred_role):
    score = 0
    
    matched_skills = 0
    
    for skill in job["skills"]:
        if skill in user_skills:
            score += 2
            matched_skills += 1
    
    # Skill percentage bonus
    if len(job["skills"]) > 0:
        match_percent = (matched_skills / len(job["skills"])) * 10
        score += match_percent
    
    # Role bonus
    if preferred_role in job["title"].lower():
        score += 5
    
    return round(score, 2)