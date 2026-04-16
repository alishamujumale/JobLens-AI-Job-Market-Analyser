from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from resume_parser import extract_text
from resume_ai import analyze_resume   # ✅ ATS added

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
    try:
        # ----------------------------
        # FILE CHECK
        # ----------------------------
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # ----------------------------
        # SAVE FILE
        # ----------------------------
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(path)

        # ----------------------------
        # STEP 1: Extract text
        # ----------------------------
        text = extract_text(path)

        if not text:
            return jsonify({"error": "Could not extract text"}), 400

        # ----------------------------
        # STEP 2: ATS ANALYSIS (NEW 🔥)
        # ----------------------------
        ats_result = analyze_resume(text)

        skills = ats_result["skills_found"]   # use ATS skills

        # ----------------------------
        # STEP 3: Job Matching
        # ----------------------------
        recommendations = match_jobs(skills, jobs)

        # ----------------------------
        # STEP 4: Skills Gap
        # ----------------------------
        skills_gap = calculate_skills_gap(skills, jobs)

        # ----------------------------
        # STEP 5: Interview Insights
        # ----------------------------
        interview_insights = generate_interview_insights(recommendations)

        # ----------------------------
        # STEP 6: Overall Status
        # ----------------------------
        overall_status = calculate_overall_status(skills, jobs)

        # ----------------------------
        # FINAL RESPONSE
        # ----------------------------
        return jsonify({
            "message": "Resume analyzed successfully",

            # ATS DATA 🔥
            "ats_score": ats_result["ats_score"],
            "skills_found": skills,
            "missing_skills": ats_result["missing_skills"],
            "sections": ats_result["sections_found"],
            "word_count": ats_result["word_count"],
            "feedback": ats_result["feedback"],
            "suggestions": ats_result["suggestions"],

            # JOB MATCHING 🔥
            "recommendations": recommendations,
            "skills_gap": skills_gap,
            "interview_insights": interview_insights,
            "overall_status": overall_status
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/match", methods=["POST"])
def match_endpoint():
    try:
        data = request.json
        user_skills = [skill.strip().lower() for skill in data.get("skills", [])]

        recommendations = match_jobs(user_skills, jobs)
        skills_gap = calculate_skills_gap(user_skills, jobs)
        interview_insights = generate_interview_insights(recommendations)
        overall_status = calculate_overall_status(user_skills, jobs)

        return jsonify({
            "skills_found": user_skills,
            "recommendations": recommendations,
            "skills_gap": skills_gap,
            "interview_insights": interview_insights,
            "overall_status": overall_status
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)