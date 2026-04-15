from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from resume_parser import extract_text, extract_skills
from matcher import (
    match_jobs, 
    calculate_job_readiness, 
    calculate_skills_gap,
    generate_interview_insights,
    calculate_overall_status
)
from data import jobs

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_resume():
    file = request.files["file"]
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    # Step 1: extract text
    text = extract_text(path)

    # Step 2: extract skills
    skills = extract_skills(text)

    # Step 3: match jobs
    recommendations = match_jobs(skills, jobs)

    # Step 4: calculate skills gap
    skills_gap = calculate_skills_gap(skills, jobs)

    # Step 5: generate interview insights
    interview_insights = generate_interview_insights(recommendations)

    # Step 6: calculate overall status
    overall_status = calculate_overall_status(skills, jobs)

    return jsonify({
        "skills_found": skills,
        "recommendations": recommendations,
        "skills_gap": skills_gap,
        "interview_insights": interview_insights,
        "overall_status": overall_status
    })

@app.route("/match", methods=["POST"])
def match_endpoint():
    """API endpoint for manual skill/role matching"""
    data = request.json
    user_skills = [skill.strip().lower() for skill in data.get("skills", [])]
    preferred_role = data.get("role", "").lower()

    # Match jobs
    recommendations = match_jobs(user_skills, jobs)

    # Calculate skills gap
    skills_gap = calculate_skills_gap(user_skills, jobs)

    # Generate interview insights
    interview_insights = generate_interview_insights(recommendations)

    # Calculate overall status
    overall_status = calculate_overall_status(user_skills, jobs)

    return jsonify({
        "skills_found": user_skills,
        "recommendations": recommendations,
        "skills_gap": skills_gap,
        "interview_insights": interview_insights,
        "overall_status": overall_status
    })

if __name__ == "__main__":
    app.run(debug=True)