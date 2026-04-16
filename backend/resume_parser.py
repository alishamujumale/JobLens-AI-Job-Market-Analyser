# resume_parser.py

import PyPDF2
import docx

# ----------------------------
# Extract text from PDF
# ----------------------------
def extract_text_from_pdf(file_path):
    text = ""
    try:
        with open(file_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() or ""
    except Exception as e:
        print("PDF Error:", e)
    return text


# ----------------------------
# Extract text from DOCX
# ----------------------------
def extract_text_from_docx(file_path):
    text = ""
    try:
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + " "
    except Exception as e:
        print("DOCX Error:", e)
    return text


# ----------------------------
# MAIN FUNCTION (IMPORTANT)
# ----------------------------
def extract_text(file_path):
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)

    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)

    else:
        return ""