from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# ----------------------------
# INTERNAL IMPORTS
# ----------------------------
from resume_parser import extract_text
from resume_ai import analyze_resume
from matcher import (
    match_jobs,
    calculate_skills_gap,
    generate_interview_insights,
    calculate_overall_status
)
from data import jobs

# ----------------------------
# DATABASE + AUTH
# ----------------------------
from models import db, User, History
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity,
    verify_jwt_in_request
)

# ----------------------------
# APP CONFIG
# ----------------------------
app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["JWT_SECRET_KEY"] = "super-secret-key"

db.init_app(app)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# =====================================================
# 🔐 AUTH ROUTES
# =====================================================

@app.route("/register", methods=["POST"])
def register():
    data = request.json

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "User already exists"}), 400

    user = User(
        username=data["username"],
        password=data["password"]
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(username=data["username"]).first()

    if not user or user.password != data["password"]:
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({"token": token})


# =====================================================
# 📄 UPLOAD + ANALYSIS
# =====================================================

@app.route("/upload", methods=["POST"])
def upload_resume():
    try:
        # FILE CHECK
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # SAVE FILE
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(path)

        # STEP 1: Extract text
        text = extract_text(path)

        if not text:
            return jsonify({"error": "Could not extract text"}), 400

        # STEP 2: ATS ANALYSIS
        ats_result = analyze_resume(text)
        skills = ats_result["skills_found"]

        # STEP 3: JOB MATCHING
        recommendations = match_jobs(skills, jobs)

        # STEP 4: SKILLS GAP
        skills_gap = calculate_skills_gap(skills, jobs)

        # STEP 5: INTERVIEW INSIGHTS
        interview_insights = generate_interview_insights(recommendations)

        # STEP 6: OVERALL STATUS
        overall_status = calculate_overall_status(skills, jobs)

        # STEP 7: SAVE HISTORY (ONLY IF LOGGED IN)
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()

            history = History(
                user_id=user_id,
                ats_score=ats_result["ats_score"],
                skills=",".join(skills),
                recommendations=str(recommendations)
            )

            db.session.add(history)
            db.session.commit()

        except:
            pass  # not logged in → skip saving

        # FINAL RESPONSE
        return jsonify({
            "ats_score": ats_result["ats_score"],
            "skills_found": skills,
            "missing_skills": ats_result["missing_skills"],
            "suggestions": ats_result["suggestions"],

            "recommendations": recommendations,
            "skills_gap": skills_gap,
            "interview_insights": interview_insights,
            "overall_status": overall_status
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =====================================================
# 📊 MATCH (MANUAL)
# =====================================================

@app.route("/match", methods=["POST"])
def match_endpoint():
    try:
        data = request.json
        user_skills = [s.strip().lower() for s in data.get("skills", [])]

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


# =====================================================
# 📜 USER HISTORY
# =====================================================

@app.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()

    records = History.query.filter_by(user_id=user_id).all()

    data = []
    for r in records:
        data.append({
            "ats_score": r.ats_score,
            "skills": r.skills,
            "recommendations": r.recommendations,
            "date": str(r.created_at)
        })

    return jsonify(data)


# =====================================================
# 🚀 RUN APP
# =====================================================

if __name__ == "__main__":
    app.run(debug=True)