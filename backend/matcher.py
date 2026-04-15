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

def calculate_job_readiness(skills, jobs):
    total_required = 0
    total_matched = 0

    for job in jobs:
        required = job["skills"]
        matched = len(set(skills) & set(required))

        total_required += len(required)
        total_matched += matched

    if total_required == 0:
        return 0

    return int((total_matched / total_required) * 100)

def calculate_skills_gap(user_skills, jobs):
    """Identifies most important missing skills across all job opportunities"""
    skill_gap = {}
    skill_importance = {}
    
    for job in jobs:
        required = job["skills"]
        missing = list(set(required) - set(user_skills))
        
        for skill in missing:
            skill_gap[skill] = skill_gap.get(skill, 0) + 1
            skill_importance[skill] = skill_importance.get(skill, [])
            skill_importance[skill].append(job["title"])
    
    # Sort by frequency (how many jobs need this skill)
    sorted_gaps = sorted(skill_gap.items(), key=lambda x: x[1], reverse=True)
    
    return [
        {
            "skill": skill,
            "frequency": count,
            "required_for": skill_importance.get(skill, [])[:3]  # Top 3 jobs
        }
        for skill, count in sorted_gaps[:10]  # Top 10 gaps
    ]

def generate_interview_insights(top_jobs):
    """Generate interview tips for top matched roles"""
    insights = []
    
    interview_tips = {
        "frontend developer": [
            "Be ready to discuss React hooks and component lifecycle",
            "Prepare for CSS layout challenges (Flexbox, Grid)",
            "Know your JavaScript closures and async/await patterns",
            "Have portfolio projects ready to demonstrate",
            "Practice live coding on UI problems"
        ],
        "backend developer": [
            "Prepare SQL optimization and database design questions",
            "Know about API design principles and REST vs GraphQL",
            "Be ready to discuss authentication and security",
            "Understand caching strategies and scalability patterns",
            "Practice system design interviews"
        ],
        "data analyst": [
            "Know SQL queries and window functions",
            "Prepare for Excel/Power BI demonstrations",
            "Understand statistical concepts (A/B testing, regression)",
            "Be ready to explain data insights and storytelling",
            "Know how to handle missing data"
        ],
        "ai engineer": [
            "Deep dive into ML algorithms and neural networks",
            "Be ready to discuss model evaluation metrics",
            "Know about overfitting and regularization",
            "Prepare to code ML solutions (scikit-learn, TensorFlow)",
            "Understand feature engineering"
        ],
        "devops engineer": [
            "Know Docker, Kubernetes, CI/CD pipelines",
            "Understand cloud platforms (AWS, Azure, GCP)",
            "Be ready to design scalable infrastructure",
            "Know about monitoring and logging",
            "Understand infrastructure as code (Terraform, Ansible)"
        ],
        "product manager": [
            "Prepare case studies and product strategy questions",
            "Know metrics for product success (OKRs, KPIs)",
            "Be ready to discuss user research and validation",
            "Understand roadmap prioritization",
            "Prepare cross-functional collaboration examples"
        ]
    }
    
    for job in top_jobs[:3]:  # Top 3 jobs
        job_title = job["title"].lower()
        tips = []
        
        for key, values in interview_tips.items():
            if key in job_title:
                tips = values
                break
        
        if not tips:
            tips = [
                f"Research the {job['title']} role thoroughly",
                "Prepare a clear explanation of your background",
                "Ask thoughtful questions about the role and team",
                "Research the company's tech stack and challenges",
                "Share relevant projects and experiences"
            ]
        
        insights.append({
            "job_title": job["title"],
            "match_score": job["match_score"],
            "tips": tips
        })
    
    return insights

def calculate_overall_status(skills, jobs):
    """Calculate overall job market readiness status"""
    readiness = calculate_job_readiness(skills, jobs)
    
    if readiness >= 80:
        status = "READY"
        message = "You're well-prepared for many opportunities! 🚀"
    elif readiness >= 60:
        status = "GOOD"
        message = "You're competitive. Focus on top gap skills!"
    elif readiness >= 40:
        status = "DEVELOPING"
        message = "You have a solid foundation. Keep learning!"
    else:
        status = "STARTING"
        message = "Great time to build key skills for your target roles!"
    
    return {
        "status": status,
        "readiness_score": readiness,
        "message": message
    }