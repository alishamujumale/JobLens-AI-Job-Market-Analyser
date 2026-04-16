# analyzer.py

def analyze_resume(text):
    text_lower = text.lower()

    # ----------------------------
    # EXPANDED SKILL LIST (NORMALIZED)
    # ----------------------------
    required_skills = [
        # Programming Languages
        "python", "java", "javascript", "c++", "c#", "ruby", "php", "go", "rust", "swift", "kotlin",
        # Web Development
        "html", "css", "react", "angular", "vue", "node.js", "express", "django", "flask", "spring",
        # Data Science & ML
        "machine learning", "ml", "data analysis", "data analytics", "pandas", "numpy", "scikit-learn",
        "tensorflow", "pytorch", "sql", "mysql", "postgresql", "mongodb", "big data", "hadoop", "spark",
        # DevOps & Tools
        "docker", "kubernetes", "aws", "azure", "gcp", "git", "jenkins", "ci/cd", "linux", "bash",
        # Other
        "agile", "scrum", "project management", "leadership", "communication"
    ]

    # ----------------------------
    # SKILL MATCHING
    # ----------------------------
    found_skills = []

    for skill in required_skills:
        if skill in text_lower:
            found_skills.append(skill)

    missing_skills = [s for s in required_skills if s not in found_skills]

    skill_score = min(len(found_skills) / len(required_skills) * 60, 60)  # Cap at 60%

    # ----------------------------
    # SECTION CHECK (EXPANDED)
    # ----------------------------
    sections = ["education", "experience", "projects", "skills", "certifications", "achievements", "summary", "contact"]

    found_sections = [sec for sec in sections if sec in text_lower]

    section_score = (len(found_sections) / len(sections)) * 25  # 25% weight

    # ----------------------------
    # LENGTH SCORE (IMPROVED)
    # ----------------------------
    word_count = len(text.split())

    if word_count > 600:
        length_score = 15
    elif word_count > 400:
        length_score = 10
    elif word_count > 200:
        length_score = 5
    else:
        length_score = 0

    # ----------------------------
    # KEYWORD DENSITY (NEW)
    # ----------------------------
    total_words = len(text.split())
    skill_keywords = sum(1 for word in text_lower.split() if word in required_skills)
    density_score = min((skill_keywords / total_words) * 100 * 0.1, 10) if total_words > 0 else 0  # 10% weight

    # ----------------------------
    # FINAL SCORE
    # ----------------------------
    ats_score = int(skill_score + section_score + length_score + density_score)

    # ----------------------------
    # PERSONALIZED SUGGESTIONS
    # ----------------------------
    suggestions = []

    if missing_skills:
        top_missing = missing_skills[:5]
        suggestions.append(f"Add these high-demand skills: {', '.join(top_missing)}")

    if len(found_sections) < 6:
        missing_sections = [s for s in sections if s not in found_sections]
        suggestions.append(f"Include missing sections: {', '.join(missing_sections[:3])}")

    if word_count < 300:
        suggestions.append("Expand your resume content - aim for 400-600 words with detailed descriptions")

    if skill_keywords < 5:
        suggestions.append("Incorporate more technical keywords relevant to your target roles")

    # Project suggestions based on missing skills
    project_suggestions = []
    if "react" in missing_skills:
        project_suggestions.append("Build a personal portfolio website using React")
    if "python" in missing_skills or "machine learning" in missing_skills:
        project_suggestions.append("Create a data analysis project with Python and Pandas")
    if "node.js" in missing_skills:
        project_suggestions.append("Develop a REST API with Node.js and Express")
    if "docker" in missing_skills:
        project_suggestions.append("Containerize a simple application using Docker")

    if project_suggestions:
        suggestions.append(f"Recommended projects: {'; '.join(project_suggestions[:2])}")

    # ----------------------------
    # FEEDBACK
    # ----------------------------
    if ats_score >= 80:
        feedback = "Excellent resume - highly optimized for ATS"
    elif ats_score >= 60:
        feedback = "Good resume with room for improvement"
    else:
        feedback = "Resume needs significant enhancements"

    return {
        "ats_score": ats_score,
        "skills_found": found_skills,
        "missing_skills": missing_skills,
        "sections_found": found_sections,
        "word_count": word_count,
        "keyword_density": round(skill_keywords / total_words * 100, 2) if total_words > 0 else 0,
        "feedback": feedback,
        "suggestions": suggestions
    }