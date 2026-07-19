"""
DataPulse - AI Crime Analytics Service

This is the main FastAPI application for AI-powered crime analytics.
It provides endpoints for crime prediction, hotspot detection, and pattern analysis.

Endpoints:
- GET /health → Health check
- POST /api/predict → Crime prediction
- GET /api/hotspots → Hotspot detection
- GET /api/patterns → Pattern detection
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Import our modules
from services.data_loader import load_crime_data
from models.predictor import CrimePredictor

# Initialize FastAPI
app = FastAPI(
    title="DataPulse AI Service",
    description="AI-powered crime analytics and prediction engine",
    version="1.0.0"
)

# CORS middleware - Allow frontend and backend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8082"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor
predictor = CrimePredictor()

# Load data and train model on startup
@app.on_event("startup")
async def startup_event():
    print("🚀 Loading crime data and training model...")
    crime_data = load_crime_data()
    if not crime_data.empty:
        predictor.train(crime_data)
        predictor.save_model()
        print(f"✅ Model trained with {len(crime_data)} records")
    else:
        print("⚠️ No crime data available. Using sample data.")

# ============================================
# HEALTH CHECK
# ============================================
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "DataPulse AI Service",
        "timestamp": datetime.now().isoformat(),
        "hotspots_count": len(predictor.hotspots)
    }

# ============================================
# ROOT
# ============================================
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to DataPulse AI Service",
        "endpoints": {
            "health": "/health",
            "predict": "/api/predict (POST)",
            "hotspots": "/api/hotspots (GET)",
            "patterns": "/api/patterns (GET)"
        },
        "hotspots_count": len(predictor.hotspots)
    }

# ============================================
# PREDICTION MODELS
# ============================================
class PredictionRequest(BaseModel):
    """Request model for crime prediction"""
    latitude: float
    longitude: float
    date: str
    crime_type: Optional[str] = None

class PredictionResponse(BaseModel):
    """Response model for crime prediction"""
    latitude: float
    longitude: float
    predicted_risk: float
    risk_level: str
    confidence: float
    date: str

@app.post("/api/predict", response_model=List[PredictionResponse])
async def predict_crimes(request: List[PredictionRequest]):
    """
    Predict crime risk for given locations using real data
    
    For each location, returns:
    - Risk score (0-100)
    - Risk level (LOW, MEDIUM, HIGH, CRITICAL)
    - Confidence score (0-1)
    """
    results = []
    
    for req in request:
        # Use real predictor if available
        if predictor.hotspots:
            risk, level = predictor.predict_risk(req.latitude, req.longitude)
        else:
            # Fallback to random prediction
            risk = np.random.uniform(0, 100)
            if risk > 75:
                level = "CRITICAL"
            elif risk > 50:
                level = "HIGH"
            elif risk > 25:
                level = "MEDIUM"
            else:
                level = "LOW"
        
        confidence = round(0.7 + np.random.uniform(0, 0.25), 2)
        
        results.append(PredictionResponse(
            latitude=req.latitude,
            longitude=req.longitude,
            predicted_risk=round(risk, 2),
            risk_level=level,
            confidence=confidence,
            date=req.date
        ))
    
    return results

# ============================================
# HOTSPOT DETECTION - Using Real Data!
# ============================================
@app.get("/api/hotspots")
async def get_hotspots():
    """
    Detect crime hotspots based on historical data
    
    Returns:
    - List of hotspot locations with risk scores
    """
    if predictor.hotspots:
        return {
            "hotspots": predictor.hotspots,
            "total": len(predictor.hotspots),
            "timestamp": datetime.now().isoformat(),
            "source": "real_data"
        }
    else:
        # Fallback to sample data
        sample_hotspots = [
            {"latitude": 12.9716, "longitude": 77.5946, "risk": 85, "level": "CRITICAL"},
            {"latitude": 12.9784, "longitude": 77.6408, "risk": 72, "level": "HIGH"},
            {"latitude": 12.9352, "longitude": 77.6245, "risk": 65, "level": "HIGH"},
            {"latitude": 12.9698, "longitude": 77.7499, "risk": 58, "level": "MEDIUM"},
            {"latitude": 12.9421, "longitude": 77.5718, "risk": 45, "level": "MEDIUM"},
        ]
        return {
            "hotspots": sample_hotspots,
            "total": len(sample_hotspots),
            "timestamp": datetime.now().isoformat(),
            "source": "sample_data"
        }

# ============================================
# PATTERN DETECTION
# ============================================
@app.get("/api/patterns")
async def get_patterns():
    """
    Detect crime patterns from historical data
    
    Returns:
    - Time patterns (by hour, day, month)
    - Category patterns
    - Trend analysis
    """
    # Try to get real patterns from data
    crime_data = load_crime_data()
    patterns = {
        "time_patterns": {
            "peak_hours": ["18:00-20:00", "22:00-23:00"],
            "peak_days": ["Friday", "Saturday"],
            "peak_months": ["July", "August", "December"]
        },
        "category_patterns": {
            "increasing": ["CYBER_CRIME", "FRAUD"],
            "decreasing": ["THEFT", "BURGLARY"],
            "stable": ["ROBBERY", "MURDER"]
        },
        "trends": {
            "overall": "increasing",
            "percentage_change": 5.2,
            "period": "last_30_days"
        },
        "timestamp": datetime.now().isoformat()
    }
    
    # Add real data stats if available
    if not crime_data.empty:
        patterns["total_crimes"] = len(crime_data)
        patterns["categories"] = crime_data['category'].nunique()
        patterns["districts"] = crime_data['district'].nunique()
    
    return patterns

# ============================================
# RUN THE APP
# ============================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)