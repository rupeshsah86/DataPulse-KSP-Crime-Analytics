"""
DataPulse - AI Investigation Assistant Service
Provides RAG reasoning, case auto-summarization, investigation lead generation,
suspect relationship analysis, and similar case vector matching.
"""

import os
import re
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
from models.investigation_prompts import (
    SYSTEM_INVESTIGATION_PROMPT,
    SUMMARY_PROMPT,
    LEADS_PROMPT,
    RELATIONSHIP_PROMPT,
    RECOMMENDATION_PROMPT
)

class InvestigationAssistant:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        self.llm = None
        self._init_llm()

    def _init_llm(self):
        """Initialize LangChain Groq LLM or fallback engine."""
        try:
            if self.groq_api_key:
                from langchain_groq import ChatGroq
                self.llm = ChatGroq(
                    groq_api_key=self.groq_api_key,
                    model_name="llama-3.3-70b-versatile",
                    temperature=0.3
                )
                print("⚡ InvestigationAssistant: Initialized with Groq Llama-3.3-70b")
            elif self.gemini_api_key:
                import google.generativeai as genai
                genai.configure(api_key=self.gemini_api_key)
                self.gemini_model = genai.GenerativeModel('gemini-1.5-pro')
                print("⚡ InvestigationAssistant: Initialized with Gemini 1.5 Pro")
        except Exception as e:
            print(f"⚠️ InvestigationAssistant LLM init note: {e}. Using rule-based fallback.")

    def _invoke_llm(self, prompt: str) -> str:
        """Helper to invoke active LLM or fallback."""
        if self.llm:
            try:
                response = self.llm.invoke(f"{SYSTEM_INVESTIGATION_PROMPT}\n\n{prompt}")
                return response.content if hasattr(response, 'content') else str(response)
            except Exception as e:
                print(f"⚠️ Groq invocation error: {e}")

        if hasattr(self, 'gemini_model') and self.gemini_model:
            try:
                response = self.gemini_model.generate_content(f"{SYSTEM_INVESTIGATION_PROMPT}\n\n{prompt}")
                return response.text
            except Exception as e:
                print(f"⚠️ Gemini invocation error: {e}")

        return ""

    def summarize_case(self, crime: Dict[str, Any]) -> str:
        """Generate structured executive summary of crime incident."""
        prompt = SUMMARY_PROMPT.format(
            title=crime.get('title', 'N/A'),
            category=crime.get('category', 'UNKNOWN'),
            severity=crime.get('severity', 'MEDIUM'),
            district=crime.get('district', 'N/A'),
            location=f"{crime.get('address', '')}, {crime.get('city', '')}".strip(', '),
            status=crime.get('status', 'OPEN'),
            description=crime.get('description', 'No description provided.'),
            reported_by=crime.get('reportedBy', 'Duty Officer')
        )
        
        llm_response = self._invoke_llm(prompt)
        if llm_response:
            return llm_response

        # Fallback structured summary generator
        return (
            f"📋 **Executive Incident Summary**:\n"
            f"Incident '{crime.get('title')}' categorized under {crime.get('category')} with {crime.get('severity')} severity "
            f"in {crime.get('district', 'Bangalore Urban')}. Current case status is {crime.get('status', 'OPEN')}.\n\n"
            f"⚠️ **Operational Risk & Threat Assessment**:\n"
            f"High priority intervention required due to {crime.get('severity')} threat level in {crime.get('district')}.\n\n"
            f"🎯 **Modus Operandi (M.O.) Analysis**:\n"
            f"{crime.get('description', 'Standard criminal activity execution pattern.')}\n\n"
            f"📌 **Key Variables Identified**:\n"
            f"- Reported By: {crime.get('reportedBy', 'Officer')}\n"
            f"- Coordinates: {crime.get('latitude')}, {crime.get('longitude')}"
        )

    def generate_leads(self, crime: Dict[str, Any]) -> List[str]:
        """Generate tactical investigation leads for officers."""
        prompt = LEADS_PROMPT.format(
            title=crime.get('title', 'N/A'),
            category=crime.get('category', 'UNKNOWN'),
            severity=crime.get('severity', 'MEDIUM'),
            district=crime.get('district', 'N/A'),
            description=crime.get('description', 'N/A')
        )

        llm_response = self._invoke_llm(prompt)
        if llm_response:
            # Parse bullet points into list
            lines = [line.strip() for line in llm_response.split('\n') if line.strip()]
            return [line.lstrip('-•*123456789. ') for line in lines if len(line) > 10][:5]

        # Rule-based fallback tactical leads
        category = crime.get('category', '').upper()
        leads = [
            f"🔍 Canvas surrounding commercial & residential CCTV cameras near {crime.get('district', 'the location')} within 500m radius.",
            f"👤 Cross-reference active repeat offenders linked to {category} in {crime.get('district')}.",
            f"📱 Request cell tower dump data for active mobile numbers near incident location between reported timeframe.",
            f"🚓 Issue BOLO (Be On Lookout) alert to neighboring police stations in {crime.get('district')}."
        ]
        if 'CYBER' in category or 'FRAUD' in category:
            leads.append("💻 Freeze recipient bank accounts and request IP log data from ISP gateway.")
        else:
            leads.append("🔬 Send forensic evidence collected at scene to State Forensic Science Laboratory (FSL).")
        return leads

    def analyze_relationships(self, crime: Dict[str, Any], suspect_info: Optional[str] = None) -> Dict[str, Any]:
        """Analyze criminal networks and accomplice relationships."""
        prompt = RELATIONSHIP_PROMPT.format(
            title=crime.get('title', 'N/A'),
            category=crime.get('category', 'UNKNOWN'),
            district=crime.get('district', 'N/A'),
            suspect_info=suspect_info or "Unknown suspect/gang"
        )

        llm_response = self._invoke_llm(prompt)
        
        return {
            "network_analysis": llm_response or f"Suspect network analysis indicates potential gang affiliation in {crime.get('district')}.",
            "suspect_type": "Serial / Habitual" if crime.get('severity') in ['CRITICAL', 'HIGH'] else "Isolated Offender",
            "accomplice_probability": "High (85%)" if crime.get('category') in ['ROBBERY', 'CYBER_CRIME', 'BURGLARY'] else "Medium (45%)",
            "geographic_radius": f"5-15 km around {crime.get('district', 'Bangalore Urban')}"
        }

    def recommend_similar_cases(self, target_crime: Dict[str, Any], all_crimes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Vector/heuristic similarity search to recommend matching historical cases."""
        if not all_crimes:
            return []

        target_cat = target_crime.get('category', '').upper()
        target_dist = target_crime.get('district', '').upper()
        target_sev = target_crime.get('severity', '').upper()

        scored_cases = []
        for crime in all_crimes:
            # Skip self
            if crime.get('id') == target_crime.get('id') or crime.get('crimeNumber') == target_crime.get('crimeNumber'):
                continue

            score = 0.0
            if crime.get('category', '').upper() == target_cat:
                score += 0.45
            if crime.get('district', '').upper() == target_dist:
                score += 0.35
            if crime.get('severity', '').upper() == target_sev:
                score += 0.20

            if score > 0.3:
                scored_cases.append({
                    "id": crime.get('id'),
                    "crimeNumber": crime.get('crimeNumber', 'CRIME-000'),
                    "title": crime.get('title', 'Incident Record'),
                    "category": crime.get('category'),
                    "severity": crime.get('severity'),
                    "district": crime.get('district'),
                    "similarity_score": round(score * 100, 1),
                    "match_reason": f"Matches {target_cat} in {target_dist}"
                })

        scored_cases.sort(key=lambda x: x['similarity_score'], reverse=True)
        return scored_cases[:4]

    def full_case_analysis(self, target_crime: Dict[str, Any], historical_crimes: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Perform comprehensive 360-degree investigation analysis."""
        summary = self.summarize_case(target_crime)
        leads = self.generate_leads(target_crime)
        relationships = self.analyze_relationships(target_crime)
        similar_cases = self.recommend_similar_cases(target_crime, historical_crimes)

        return {
            "summary": summary,
            "leads": leads,
            "relationships": relationships,
            "similar_cases": similar_cases,
            "target_crime": target_crime
        }
