# analyzer.py

def analyze_resume(text):
    text_lower = text.lower()

    # ----------------------------
    # 1. SKILL MATCHING
    # ----------------------------
    required_skills = [
        "python", "java", "sql", "machine learning",
        "data analysis", "react", "html", "css",
        "javascript", "flask", "django"
    ]

    found_skills = [skill for skill in required_skills if skill in text_lower]
    missing_skills = [skill for skill in required_skills if skill not in text_lower]

    skill_score = (len(found_skills) / len(required_skills)) * 50   # 50% weight

    # ----------------------------
    # 2. SECTION CHECK
    # ----------------------------
    sections = ["education", "projects", "skills", "experience"]
    found_sections = [sec for sec in sections if sec in text_lower]

    section_score = (len(found_sections) / len(sections)) * 30   # 30% weight

    # ----------------------------
    # 3. RESUME LENGTH CHECK
    # ----------------------------
    word_count = len(text.split())

    if word_count < 200:
        length_score = 5
    elif word_count < 500:
        length_score = 15
    else:
        length_score = 20   # max

    # ----------------------------
    # FINAL ATS SCORE
    # ----------------------------
    ats_score = int(skill_score + section_score + length_score)

    # ----------------------------
    # FEEDBACK
    # ----------------------------
    suggestions = []

    if missing_skills:
        suggestions.append(f"Add missing skills: {', '.join(missing_skills[:5])}")

    if len(found_sections) < 4:
        suggestions.append("Include all sections: Education, Projects, Skills, Experience")

    if word_count < 300:
        suggestions.append("Increase resume content (add projects or details)")

    if ats_score > 80:
        feedback = "Excellent resume"
    elif ats_score > 60:
        feedback = "Good resume, but can be improved"
    else:
        feedback = "Needs improvement"

    return {
        "ats_score": ats_score,
        "skills_found": found_skills,
        "missing_skills": missing_skills,
        "sections_found": found_sections,
        "word_count": word_count,
        "feedback": feedback,
        "suggestions": suggestions
    }