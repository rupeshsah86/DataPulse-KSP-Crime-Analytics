"""
DataPulse - Voice API Router
FastAPI router for processing spoken voice transcripts, intent parsing, and audio text-to-speech responses.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.voice_service import VoiceService

router = APIRouter(prefix="/api/voice", tags=["Voice Assistant"])
voice_service = VoiceService()

class VoiceRequest(BaseModel):
    transcript: str

@router.post("/intent")
async def process_voice_intent(request: VoiceRequest):
    """
    Parses spoken voice transcript into navigation targets, search queries, and TTS audio responses.
    """
    try:
        result = voice_service.process_voice_input(request.transcript)
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice intent processing failed: {str(e)}")
