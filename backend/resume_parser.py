import pdfminer.high_level
import docx

def extract_text(file_path):
    if file_path.endswith(".pdf"):
        return pdfminer.high_level.extract_text(file_path)
    
    elif file_path.endswith(".docx"):
        doc = docx.Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])

    return ""

def extract_skills(text):
    skills_db = [
        "python","java","c++","sql","flask","django",
        "html","css","javascript","react","node",
        "power bi","excel","machine learning"
    ]

    text = text.lower()
    found = []

    for skill in skills_db:
        if skill in text:
            found.append(skill)

    return list(set(found))