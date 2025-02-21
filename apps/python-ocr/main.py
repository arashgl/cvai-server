from fastapi import FastAPI, UploadFile
import pytesseract
import cv2
from pdf2image import convert_from_bytes
import numpy as np
import pdfplumber
import io

app = FastAPI()


@app.post("/extract-text")
async def extract_text(file: UploadFile):
    print("Received file:", file.filename)
    contents = await file.read()
    print("ReadFile")

    # First try to extract text directly from PDF
    text_output = ""
    try:
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            for page_num, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if page_text and page_text.strip():
                    text_output += f"\n--- Page {page_num + 1} ---\n{page_text}"
    except Exception as e:
        print(f"Error extracting text directly: {e}")
        text_output = ""

    print(text_output, "<<")
    # If no text was extracted, use OCR
    if not text_output.strip():
        print("No text found in PDF, using OCR")
        # Convert PDF pages to images
        images = convert_from_bytes(contents)

        for page_num, image in enumerate(images):
            # Convert PIL image to OpenCV format
            img_cv = np.array(image)
            # Convert to grayscale
            img_cv = cv2.cvtColor(img_cv, cv2.COLOR_RGB2GRAY)

            # Apply thresholding to improve OCR accuracy
            img_cv = cv2.threshold(
                img_cv, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

            # Perform OCR
            text = pytesseract.image_to_string(img_cv)
            text_output += f"\n--- Page {page_num + 1} ---\n{text}"

    return {"text": text_output}
