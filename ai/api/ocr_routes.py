"""
DataPulse - OCR Routes API
FastAPI router for scanning FIR PDF and image documents and returning structured crime JSON.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ocr_service import OCRService

router = APIRouter(prefix="/api/ocr", tags=["OCR Document Scanner"])
ocr_service = OCRService()

@router.post("/extract")
async def extract_fir_document(file: UploadFile = File(...)):
    """
    Extracts raw text and structured crime fields from uploaded FIR PDF or image file.
    """
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        result = ocr_service.extract_and_structure_fir(file_bytes, file.filename)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR FIR processing failed: {str(e)}")
