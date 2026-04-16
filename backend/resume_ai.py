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
    # ENHANCED SUGGESTIONS FOR MISSING SKILLS
    # ----------------------------
    suggestions = []  # Initialize suggestions list

    skill_resources = {
        "python": {
            "learning": "Start with freeCodeCamp Python course or Codecademy",
            "projects": "Build a web scraper, data analyzer, or automation script",
            "certification": "Consider Python Institute certifications"
        },
        "java": {
            "learning": "Oracle Java tutorials or Udemy Java courses",
            "projects": "Create a Spring Boot application or Android app",
            "certification": "Oracle Java certifications"
        },
        "javascript": {
            "learning": "MDN Web Docs or freeCodeCamp JavaScript curriculum",
            "projects": "Build interactive web apps with vanilla JS or frameworks",
            "certification": "Consider freeCodeCamp certifications"
        },
        "react": {
            "learning": "Official React documentation or React for Beginners course",
            "projects": "Create a todo app, e-commerce site, or dashboard",
            "certification": "Meta React Developer Certificate"
        },
        "node.js": {
            "learning": "Node.js official docs or Express.js tutorials",
            "projects": "Build REST APIs, chat applications, or real-time apps",
            "certification": "Node.js certifications from Linux Academy"
        },
        "sql": {
            "learning": "SQLZoo or Khan Academy SQL courses",
            "projects": "Design database schemas, write complex queries",
            "certification": "Microsoft SQL Server or Oracle SQL certifications"
        },
        "machine learning": {
            "learning": "Coursera's Andrew Ng ML course or fast.ai",
            "projects": "Build image classifiers, recommendation systems",
            "certification": "Google ML Engineer or TensorFlow certificates"
        },
        "docker": {
            "learning": "Docker official getting started guide",
            "projects": "Containerize existing apps, create multi-container setups",
            "certification": "Docker Certified Associate"
        },
        "aws": {
            "learning": "AWS free tier and documentation",
            "projects": "Deploy apps on EC2, use S3 for storage",
            "certification": "AWS Certified Cloud Practitioner"
        },
        "git": {
            "learning": "Git official documentation or Atlassian Git tutorials",
            "projects": "Contribute to open source, manage project versions",
            "certification": "Git certifications from various platforms"
        }
    }

    if missing_skills:
        top_missing = missing_skills[:5]
        suggestions.append(f" Priority Skills to Learn: {', '.join(top_missing)}")

        # Add specific advice for top 3 missing skills
        for skill in top_missing[:3]:
            if skill in skill_resources:
                res = skill_resources[skill]
                suggestions.append(f" For {skill.title()}: {res['learning']}")
                suggestions.append(f" Project Idea: {res['projects']}")
                if res['certification'] != "N/A":
                    suggestions.append(f" Certification: {res['certification']}")

    # General improvement suggestions
    if len(found_skills) < 5:
        suggestions.append(" Focus on core skills first: Python, JavaScript, SQL, and a framework like React")

    if not any(s in found_skills for s in ["react", "angular", "vue"]):
        suggestions.append(" Learn a frontend framework - React is most in-demand")

    if not any(s in found_skills for s in ["node.js", "django", "flask", "spring"]):
        suggestions.append(" Add backend development skills to your toolkit")

    if not any(s in found_skills for s in ["aws", "docker", "kubernetes"]):
        suggestions.append(" Cloud and DevOps skills are highly valuable - start with AWS or Docker")

    # Career progression tips
    if len(found_skills) > 10:
        suggestions.append(" Consider specializing in a niche area like AI/ML, DevOps, or Full-stack development")

    if "leadership" not in found_skills and len(found_skills) > 8:
        suggestions.append(" Add soft skills like leadership, communication, and project management")

    # Actionable next steps
    suggestions.append(" Set learning goals: Dedicate 1-2 hours daily to skill development")
    suggestions.append(" Research job postings to understand exact requirements for your target roles")

    # ----------------------------
    # FEEDBACK
    # ----------------------------
    if ats_score >= 85:
        feedback = "🎉 Excellent resume - highly optimized for ATS systems!"
    elif ats_score >= 70:
        feedback = "✅ Good resume with strong foundation - minor improvements needed"
    elif ats_score >= 50:
        feedback = "⚠️ Decent resume but needs significant enhancements"
    else:
        feedback = "🔴 Resume requires major improvements to pass ATS filters"

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