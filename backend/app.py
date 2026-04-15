# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from data import get_job_matches

app = Flask(__name__)
CORS(app)

@app.route("/match", methods=["POST"])
def match_jobs():
    data = request.json

    user_skills = data.get("skills", [])
    preferred_role = data.get("role", "").lower()

    results = get_job_matches(user_skills, preferred_role)

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)