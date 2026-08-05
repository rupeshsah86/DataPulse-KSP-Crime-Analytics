"""
DataPulse - Patrol Routes API Router
FastAPI Router for generating predictive patrol routes and scheduling.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.patrol_service import PatrolService

router = APIRouter(prefix="/api/patrol", tags=["Predictive Patrol Routes"])
patrol_service = PatrolService()

class RouteRequest(BaseModel):
    district: Optional[str] = "Bangalore Urban"
    unit_name: Optional[str] = "Patrol Unit Alpha-1"
    shift_time: Optional[str] = "Night Shift (22:00 - 06:00)"

@router.post("/routes")
async def generate_patrol_route(request: RouteRequest):
    """
    Generate an AI-optimized predictive patrol route based on crime density heatmap clusters.
    """
    try:
        route = patrol_service.generate_predictive_route(
            district=request.district,
            unit_name=request.unit_name,
            shift_time=request.shift_time
        )
        return route
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate patrol route: {str(e)}")

@router.get("/routes")
async def get_default_patrol_route():
    """
    Get default predictive patrol route.
    """
    try:
        return patrol_service.generate_predictive_route()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve default patrol route: {str(e)}")
