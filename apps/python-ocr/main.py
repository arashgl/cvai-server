from fastapi import FastAPI, UploadFile
import pytesseract
import cv2
from pdf2image import convert_from_bytes
import numpy as np

app = FastAPI()


@app.post("/extract-text")
async def extract_text(file: UploadFile):
    contents = await file.read()

    # Convert PDF pages to images
    images = convert_from_bytes(contents)
    text_output = ""

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
