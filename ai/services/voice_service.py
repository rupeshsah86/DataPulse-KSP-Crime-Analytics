"""
DataPulse - AI Voice Assistant Service
Parses spoken voice transcripts with Groq LLM for intent recognition,
route navigation commands, and natural voice query responses.
"""

import os
import json
import re
from typing import Dict, Any

class VoiceService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.llm = None
        self._init_llm()

    def _init_llm(self):
        try:
            if self.groq_api_key:
                from langchain_groq import ChatGroq
                self.llm = ChatGroq(
                    groq_api_key=self.groq_api_key,
                    model_name="llama-3.3-70b-versatile",
                    temperature=0.2
                )
                print("⚡ VoiceService: Initialized with Groq Llama-3.3-70b")
        except Exception as e:
            print(f"⚠️ VoiceService Groq init note: {e}")

    def process_voice_input(self, transcript: str) -> Dict[str, Any]:
        """
        Parses spoken transcript into structured intent and spoken response text.
        """
        if not transcript or not transcript.strip():
            return {
                "intent": "UNKNOWN",
                "target_route": None,
                "spoken_response": "I didn't catch that. Please speak clearly into your microphone.",
                "search_query": None
            }

        transcript_clean = transcript.strip().lower()

        # Rule-based fast navigation intent matching
        if "dashboard" in transcript_clean or "home" in transcript_clean:
            return {
                "intent": "NAVIGATE",
                "target_route": "/dashboard",
                "spoken_response": "Navigating to Command Dashboard.",
                "search_query": None
            }
        if "patrol" in transcript_clean or "route" in transcript_clean:
            return {
                "intent": "NAVIGATE",
                "target_route": "/patrol",
                "spoken_response": "Opening Predictive Patrol Routes dispatch.",
                "search_query": None
            }
        if "3d" in transcript_clean or "three d" in transcript_clean:
            return {
                "intent": "NAVIGATE",
                "target_route": "/map/3d",
                "spoken_response": "Opening 3D Spatial Heatmap visualizer.",
                "search_query": None
            }
        if "map" in transcript_clean or "hotspot" in transcript_clean:
            return {
                "intent": "NAVIGATE",
                "target_route": "/map",
                "spoken_response": "Navigating to GIS Crime Map.",
                "search_query": None
            }
        if "analytics" in transcript_clean or "report" in transcript_clean or "state" in transcript_clean:
            return {
                "intent": "NAVIGATE",
                "target_route": "/analytics",
                "spoken_response": "Opening Analytics Dashboard.",
                "search_query": None
            }
        if "ai" in transcript_clean or "insights" in transcript_clean or "copilot" in transcript_clean:
            return {
                "intent": "NAVIGATE",
                "target_route": "/ai",
                "spoken_response": "Opening AI Insights and Copilot.",
                "search_query": None
            }

        # Groq LLM intent & voice query answering
        if self.llm:
            try:
                prompt = (
                    f"You are DataPulse Voice Copilot for Karnataka State Police. The officer said: '{transcript}'.\n"
                    "Determine intent (NAVIGATE, SEARCH, QUERY, DICTATE_REPORT).\n"
                    "Provide a concise, professional 1-2 sentence spoken response suitable for text-to-speech audio.\n"
                    "Format output as JSON with keys: intent, target_route, spoken_response, search_query."
                )
                response = self.llm.invoke(prompt)
                content = response.content if hasattr(response, 'content') else str(response)
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group(0))
            except Exception as e:
                print(f"⚠️ Voice Groq error: {e}")

        # Fallback query response
        return {
            "intent": "QUERY",
            "target_route": None,
            "spoken_response": f"Understood officer. Processing query: {transcript}.",
            "search_query": transcript
        }
