"""
DataPulse - AI Investigation Routes
FastAPI Router for case auto-summarization, lead generation, relationship analysis,
and vector similarity case recommendations.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.investigation_assistant import InvestigationAssistant
from services.data_loader import load_crime_data

router = APIRouter(prefix="/api/investigation", tags=["Investigation Assistant"])
assistant = InvestigationAssistant()

class AnalyzeRequest(BaseModel):
    crime: Dict[str, Any]
    historical_crimes: Optional[List[Dict[str, Any]]] = []

class SummarizeRequest(BaseModel):
    crime: Dict[str, Any]

class LeadsRequest(BaseModel):
    crime: Dict[str, Any]

@router.post("/analyze")
async def analyze_case(request: AnalyzeRequest):
    """
    360-degree AI Case Analysis:
    Returns executive summary, tactical leads, criminal network correlation,
    and recommended similar historical cases.
    """
    try:
        historical = request.historical_crimes
        if not historical:
            # Fallback load from dataset if not provided by client
            df = load_crime_data()
            if not df.empty:
                historical = df.to_dict(orient='records')

        result = assistant.full_case_analysis(request.crime, historical)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Investigation analysis failed: {str(e)}")

@router.post("/summarize")
async def summarize_case(request: SummarizeRequest):
    """Auto-summarize crime details into structured executive briefing."""
    try:
        summary = assistant.summarize_case(request.crime)
        return {"summary": summary, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")

@router.post("/leads")
async def generate_leads(request: LeadsRequest):
    """Generate prioritized tactical investigation leads."""
    try:
        leads = assistant.generate_leads(request.crime)
        return {"leads": leads, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Leads generation failed: {str(e)}")
