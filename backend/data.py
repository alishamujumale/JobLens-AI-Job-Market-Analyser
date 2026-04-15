# backend/data.py

jobs = [
    {
        "title": "Frontend Developer",
        "skills": ["html", "css", "javascript", "react"]
    },
    {
        "title": "Backend Developer",
        "skills": ["python", "flask", "sql", "api"]
    },
    {
        "title": "Data Analyst",
        "skills": ["python", "sql", "excel", "power bi"]
    },
    {
        "title": "AI Engineer",
        "skills": ["python", "machine learning", "tensorflow"]
    },
    {
        "title": "DevOps Engineer",
        "skills": ["docker", "kubernetes", "aws", "ci/cd"]
    },
    {
        "title": "Mobile Developer",
        "skills": ["java", "kotlin", "swift", "react native"]
    },
    {
        "title": "Cloud Architect",
        "skills": ["aws", "azure", "gcp", "cloud security"]
    },
    {
        "title": "Cybersecurity Analyst",
        "skills": ["network security", "penetration testing", "incident response"]
    },
    {
        "title": "Product Manager",
        "skills": ["agile", "scrum", "roadmap planning", "stakeholder management"]
    },
    {
        "title": "UX Designer",
        "skills": ["wireframing", "prototyping", "user research", "adobe xd"]
    }
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