# ==============================
# JobLens AI - SMART MATCHER v2 FIXED
# ==============================

# ---------- PROJECT SCORE ----------
def calculate_project_score(resume_text):

    text = resume_text.lower() if isinstance(resume_text, str) else " ".join(resume_text).lower()

    score = 0

    if any(x in text for x in ["vercel", "netlify", "aws", "render", "live", "github pages"]):
        score += 30

    if any(x in text for x in ["flask", "django", "node", "express", "api"]):
        score += 20

    if any(x in text for x in ["ml", "ai", "cnn", "nlp", "recommendation", "deep learning"]):
        score += 25

    if any(x in text for x in ["mysql", "mongodb", "postgres", "sqlite"]):
        score += 15

    if "github" in text:
        score += 10

    return min(score, 100)


# ---------- JOB MATCHING ----------
def match_jobs(user_skills, jobs, resume_text=""):

    results = []

    project_score = calculate_project_score(resume_text)

    user_skills = [s.lower().strip() for s in user_skills]

    for job in jobs:

        required = job.get("skills", [])
        required = [s.lower().strip() for s in required]

        matched = list(set(user_skills) & set(required))
        missing = list(set(required) - set(user_skills))

        skill_score = (len(matched) / len(required)) * 100 if required else 0

        final_score = (
            0.6 * skill_score +
            0.3 * project_score +
            0.1 * min(len(user_skills) * 5, 100)
        )

        results.append({
            "title": job.get("title", "Unknown"),
            "match_score": round(final_score, 2),
            "matched_skills": matched,
            "missing_skills": missing,
            "skill_score": round(skill_score, 2),
            "project_score": project_score
        })

    return sorted(results, key=lambda x: x["match_score"], reverse=True)


# ---------- JOB READINESS ----------
def calculate_job_readiness(skills, jobs, resume_text=""):

    project_score = calculate_project_score(resume_text)

    total_required = 0
    total_matched = 0

    skills = [s.lower().strip() for s in skills]

    for job in jobs:

        required = [s.lower().strip() for s in job.get("skills", [])]

        total_required += len(required)
        total_matched += len(set(skills) & set(required))

    skill_score = (total_matched / total_required) * 100 if total_required else 0

    readiness = (
        0.5 * skill_score +
        0.3 * project_score +
        0.2 * min(len(skills) * 5, 100)
    )

    return round(readiness, 2)


# ---------- OVERALL STATUS ----------
def calculate_overall_status(skills, jobs, resume_text=""):

    readiness = calculate_job_readiness(skills, jobs, resume_text)

    if readiness >= 85:
        return {
            "status": "JOB READY 🚀",
            "readiness_score": readiness,
            "message": "You are ready to apply for roles with confidence."
        }

    elif readiness >= 65:
        return {
            "status": "COMPETITIVE 🟡",
            "readiness_score": readiness,
            "message": "You have good foundations; focus on a few missing skills to improve."
        }

    elif readiness >= 45:
        return {
            "status": "DEVELOPING 🟠",
            "readiness_score": readiness,
            "message": "You are progressing; add more practical experience and skills."
        }

    else:
        return {
            "status": "BEGINNER 🔴",
            "readiness_score": readiness,
            "message": "Start building core skills and projects to increase your readiness."
        }


# ---------- SKILL GAP ----------
def calculate_skills_gap(user_skills, jobs):

    skill_gap = {}
    skill_importance = {}

    user_skills = [s.lower().strip() for s in user_skills]

    for job in jobs:

        required = [s.lower().strip() for s in job.get("skills", [])]

        missing = list(set(required) - set(user_skills))

        for skill in missing:
            skill_gap[skill] = skill_gap.get(skill, 0) + 1
            skill_importance.setdefault(skill, []).append(job.get("title"))

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
        "frontend": ["React", "CSS", "JS async", "UI design"],
        "backend": ["APIs", "DB design", "auth", "system design"],
        "data": ["SQL", "Pandas", "Visualization", "Stats"],
        "ai": ["ML basics", "NLP", "DL", "evaluation"],
        "devops": ["Docker", "CI/CD", "Cloud", "Monitoring"]
    }

    insights = []

    for job in top_jobs[:3]:

        title = job.get("title", "").lower()

        tips = []

        for key in interview_tips:
            if key in title:
                tips = interview_tips[key]
                break

        if not tips:
            tips = [
                "Understand role",
                "Prepare projects",
                "System basics",
                "HR questions",
                "Company research"
            ]

        insights.append({
            "job_title": job.get("title"),
            "match_score": job.get("match_score"),
            "tips": tips
        })

    return insights