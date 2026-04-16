from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# ----------------------------
# USER TABLE
# ----------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# ----------------------------
# HISTORY TABLE
# ----------------------------
class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    
    ats_score = db.Column(db.Integer)
    readiness_score = db.Column(db.Float)
    skills = db.Column(db.Text)
    missing_skills = db.Column(db.Text)
    sections_found = db.Column(db.Text)
    keyword_density = db.Column(db.Float)
    feedback = db.Column(db.Text)
    suggestions = db.Column(db.Text)
    recommendations = db.Column(db.Text)
    skills_gap = db.Column(db.Text)
    interview_insights = db.Column(db.Text)
    overall_status = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())