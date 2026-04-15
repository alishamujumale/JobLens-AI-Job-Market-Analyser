from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from resume_parser import extract_text, extract_skills
from matcher import match_jobs
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
    results = match_jobs(skills, jobs)

    return jsonify({
        "skills_found": skills,
        "recommendations": results
    })

if __name__ == "__main__":
    app.run(debug=True)