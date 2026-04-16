# resume_parser.py

from pdfminer.high_level import extract_text as pdf_extract_text
import docx

# ----------------------------
# Extract text from PDF
# ----------------------------
def extract_text_from_pdf(file_path):
    try:
        return pdf_extract_text(file_path)
    except Exception as e:
        print("PDF Error:", e)
        return ""

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