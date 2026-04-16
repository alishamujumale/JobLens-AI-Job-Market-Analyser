from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import json
from sqlalchemy import inspect, text

# ============================
# JWT AUTH
# ============================
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)

# ============================
# DATABASE
# ============================
from models import db, User, History

# ============================
# INTERNAL IMPORTS
# ============================
from resume_parser import extract_text
from resume_ai import analyze_resume
from matcher import (
    match_jobs,
    calculate_skills_gap,
    generate_interview_insights,
    calculate_overall_status
)
from data import jobs

# ============================
# APP CONFIG
# ============================
app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["JWT_SECRET_KEY"] = "super-secret-key-super-secret-key"
app.config["JWT_ERROR_MESSAGE_KEY"] = "error"

db.init_app(app)
jwt = JWTManager(app)


# JWT error handlers
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"error": "Missing or invalid authorization token."}), 401

@jwt.invalid_token_loader
def invalid_token_response(callback):
    return jsonify({"error": "Invalid token. Please log in again."}), 401

@jwt.expired_token_loader
def expired_token_response(jwt_header, jwt_payload):
    return jsonify({"error": "Token has expired. Please log in again."}), 401

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# user_history = {}  # REMOVED - now using DB

def ensure_history_columns():
    # For development: drop and recreate history table to ensure schema is up to date
    with db.engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS history"))
        db.create_all()  # Recreate with new schema

with app.app_context():
    db.create_all()
    ensure_history_columns()


# =====================================================
# AUTH ROUTES
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

    token = create_access_token(identity=user.username)

    return jsonify({"token": token})


# =====================================================
# UPLOAD + RESUME ANALYSIS
# =====================================================

@app.route("/upload", methods=["POST"])
@jwt_required()
def upload_resume():
    try:
        # -------------------------
        # Step 1: Save file
        # -------------------------
        file = request.files["file"]
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(path)

        # -------------------------
        # Step 2: Extract text
        # -------------------------
        text = extract_text(path)

        # -------------------------
        # Step 3: AI Resume Analysis (FIXED)
        # IMPORTANT: resume_ai returns "skills_found"
        # -------------------------
        result = analyze_resume(text)

        skills = result.get("skills_found", [])   # ✅ FIXED (THIS WAS BUG)

        ats_score = result.get("ats_score", 0)

        # -------------------------
        # Step 4: Job Matching (v2 matcher needs resume_text)
        # -------------------------
        recommendations = match_jobs(skills, jobs, text)

        # -------------------------
        # Step 5: Skills Gap
        # -------------------------
        skills_gap = calculate_skills_gap(skills, jobs)

        # -------------------------
        # Step 6: Interview Insights
        # -------------------------
        interview_insights = generate_interview_insights(recommendations)

        # -------------------------
        # Step 7: Overall Status (v2 requires resume_text)
        # -------------------------
        overall_status = calculate_overall_status(skills, jobs, text)

        # ------------------------- 
        # Step 8: Save History
        # -------------------------
        user = get_jwt_identity()
        user_obj = User.query.filter_by(username=user).first()
        
        if user_obj:
            history_entry = History(
                user_id=user_obj.id,
                ats_score=ats_score,
                readiness_score=overall_status.get("readiness_score"),
                skills=json.dumps(skills),
                missing_skills=json.dumps(result.get("missing_skills", [])),
                sections_found=json.dumps(result.get("sections_found", [])),
                keyword_density=result.get("keyword_density", 0),
                feedback=result.get("feedback", ""),
                suggestions=json.dumps(result.get("suggestions", [])),
                recommendations=json.dumps(recommendations),
                skills_gap=json.dumps(skills_gap),
                interview_insights=json.dumps(interview_insights),
                overall_status=json.dumps(overall_status)
            )
            db.session.add(history_entry)
            db.session.commit()

        # -------------------------
        # RESPONSE
        # -------------------------
        return jsonify({
            "skills_found": skills,
            "ats_score": ats_score,
            "missing_skills": result.get("missing_skills", []),
            "sections_found": result.get("sections_found", []),
            "keyword_density": result.get("keyword_density", 0),
            "feedback": result.get("feedback", ""),
            "suggestions": result.get("suggestions", []),
            "recommendations": recommendations,
            "skills_gap": skills_gap,
            "interview_insights": interview_insights,
            "overall_status": overall_status
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =====================================================
# MANUAL MATCHING ENDPOINT
# =====================================================

@app.route("/match", methods=["POST"])
def match_endpoint():
    try:
        data = request.json
        user_skills = [s.strip().lower() for s in data.get("skills", [])]

        recommendations = match_jobs(user_skills, jobs)

        return jsonify({
            "skills_found": user_skills,
            "recommendations": recommendations,
            "skills_gap": calculate_skills_gap(user_skills, jobs),
            "interview_insights": generate_interview_insights(recommendations),
            "overall_status": calculate_overall_status(user_skills, jobs)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =====================================================
# HISTORY
# =====================================================

@app.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user = get_jwt_identity()
    user_obj = User.query.filter_by(username=user).first()
    
    if not user_obj:
        return jsonify({"error": "User not found"}), 404
    
    history_entries = History.query.filter_by(user_id=user_obj.id).order_by(History.created_at.desc()).all()
    
    history_data = []
    for entry in history_entries:
        history_data.append({
            "id": entry.id,
            "ats_score": entry.ats_score,
            "readiness_score": entry.readiness_score,
            "skills": json.loads(entry.skills) if entry.skills else [],
            "missing_skills": json.loads(entry.missing_skills) if entry.missing_skills else [],
            "sections_found": json.loads(entry.sections_found) if entry.sections_found else [],
            "keyword_density": entry.keyword_density,
            "feedback": entry.feedback,
            "suggestions": json.loads(entry.suggestions) if entry.suggestions else [],
            "recommendations": json.loads(entry.recommendations) if entry.recommendations else [],
            "skills_gap": json.loads(entry.skills_gap) if entry.skills_gap else [],
            "interview_insights": json.loads(entry.interview_insights) if entry.interview_insights else [],
            "overall_status": json.loads(entry.overall_status) if entry.overall_status else {},
            "date": entry.created_at.isoformat()
        })
    
    return jsonify({"history": history_data})


# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":
    app.run(debug=True)