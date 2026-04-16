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
    skills = db.Column(db.Text)
    recommendations = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())