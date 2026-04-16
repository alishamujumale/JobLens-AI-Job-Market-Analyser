# ==============================
# JobLens AI - SMART MATCHER v2
# ==============================

# ---------- PROJECT SCORE ----------
def calculate_project_score(resume_text):
    text = " ".join(resume_text).lower()

    score = 0

    # Deployment signals (VERY IMPORTANT)
    if any(x in text for x in ["vercel", "netlify", "aws", "render", "live", "github pages"]):
        score += 30

    # Backend / API experience
    if any(x in text for x in ["flask", "django", "node", "express", "api"]):
        score += 20

    # Advanced AI / ML projects
    if any(x in text for x in ["ml", "ai", "cnn", "nlp", "recommendation", "deep learning"]):
        score += 25

    # Database experience
    if any(x in text for x in ["mysql", "mongodb", "postgres", "sqlite"]):
        score += 15

    # GitHub presence
    if "github" in text:
        score += 10

    return min(score, 100)


# ---------- JOB MATCHING ----------
def match_jobs(user_skills, jobs, resume_text=[]):
    results = []

    project_score = calculate_project_score(resume_text)

    for job in jobs:
        required = job["skills"]

        matched = list(set(user_skills) & set(required))
        missing = list(set(required) - set(user_skills))

        # Skill match %
        skill_score = (len(matched) / len(required)) * 100 if required else 0

        # FINAL AI SCORE (weighted system)
        final_score = (
            0.6 * skill_score +
            0.3 * project_score +
            0.1 * min(len(user_skills) * 5, 100)
        )

        results.append({
            "title": job["title"],
            "match_score": round(final_score, 2),
            "matched_skills": matched,
            "missing_skills": missing,
            "skill_score": round(skill_score, 2),
            "project_score": project_score
        })

    return sorted(results, key=lambda x: x["match_score"], reverse=True)


# ---------- JOB READINESS ----------
def calculate_job_readiness(skills, jobs, resume_text=[]):

    project_score = calculate_project_score(resume_text)

    total_required = 0
    total_matched = 0

    for job in jobs:
        required = job["skills"]
        matched = len(set(skills) & set(required))

        total_required += len(required)
        total_matched += matched

    skill_score = (total_matched / total_required) * 100 if total_required else 0

    readiness = (
        0.5 * skill_score +
        0.3 * project_score +
        0.2 * min(len(skills) * 5, 100)
    )

    return round(readiness, 2)


# ---------- OVERALL STATUS ----------
def calculate_overall_status(skills, jobs, resume_text=[]):

    readiness = calculate_job_readiness(skills, jobs, resume_text)

    if readiness >= 85:
        return {
            "status": "JOB READY 🚀",
            "readiness_score": readiness,
            "message": "Strong profile with real-world project experience!"
        }

    elif readiness >= 65:
        return {
            "status": "COMPETITIVE 🟡",
            "readiness_score": readiness,
            "message": "Good profile. Improve deployment & advanced projects."
        }

    elif readiness >= 45:
        return {
            "status": "DEVELOPING 🟠",
            "readiness_score": readiness,
            "message": "Build more real-world deployed projects."
        }

    else:
        return {
            "status": "BEGINNER 🔴",
            "readiness_score": readiness,
            "message": "Focus on core skills + 2–3 strong projects."
        }


# ---------- SKILL GAP ANALYSIS ----------
def calculate_skills_gap(user_skills, jobs):

    skill_gap = {}
    skill_importance = {}

    for job in jobs:
        required = job["skills"]
        missing = list(set(required) - set(user_skills))

        for skill in missing:
            skill_gap[skill] = skill_gap.get(skill, 0) + 1
            skill_importance[skill] = skill_importance.get(skill, [])
            skill_importance[skill].append(job["title"])

    sorted_gaps = sorted(skill_gap.items(), key=lambda x: x[1], reverse=True)

    return [
        {
            "skill": skill,
            "frequency": count,
            "required_for": skill_importance.get(skill, [])[:3]
        }
        for skill, count in sorted_gaps[:10]
    ]


# ---------- INTERVIEW INSIGHTS ----------
def generate_interview_insights(top_jobs):

    interview_tips = {
        "frontend": [
            "React hooks, lifecycle methods",
            "CSS Flexbox & Grid",
            "JavaScript async/await & closures",
            "Build portfolio projects",
            "UI optimization questions"
        ],
        "backend": [
            "REST API design",
            "Database optimization (SQL)",
            "Authentication & security",
            "System design basics",
            "Scalability concepts"
        ],
        "data": [
            "SQL queries & joins",
            "Statistics basics",
            "Data visualization tools",
            "Python data libraries",
            "Business insights storytelling"
        ],
        "ai": [
            "ML algorithms basics",
            "Model evaluation metrics",
            "Overfitting & tuning",
            "Feature engineering",
            "Deep learning basics"
        ],
        "devops": [
            "Docker & Kubernetes",
            "CI/CD pipelines",
            "Cloud (AWS/Azure)",
            "Infrastructure as code",
            "Monitoring tools"
        ],
        "product": [
            "Product case studies",
            "User research",
            "Metrics (KPIs, OKRs)",
            "Roadmap planning",
            "Stakeholder communication"
        ]
    }

    insights = []

    for job in top_jobs[:3]:

        title = job["title"].lower()
        tips = []

        for key in interview_tips:
            if key in title:
                tips = interview_tips[key]
                break

        if not tips:
            tips = [
                "Understand role deeply",
                "Prepare project explanation",
                "Be ready for HR + technical questions",
                "Research company tech stack",
                "Showcase real projects"
            ]

        insights.append({
            "job_title": job["title"],
            "match_score": job["match_score"],
            "tips": tips
        })

    return insights