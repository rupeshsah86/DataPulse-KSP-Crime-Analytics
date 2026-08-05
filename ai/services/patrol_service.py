"""
DataPulse - Patrol Service
High-level service managing predictive patrol route generation and scheduling.
"""

from typing import Dict, List, Any, Optional
from algorithms.route_optimizer import RouteOptimizer
from services.data_loader import load_crime_data
from datetime import datetime

class PatrolService:
    def __init__(self):
        self.optimizer = RouteOptimizer()

    def generate_predictive_route(
        self,
        district: Optional[str] = "Bangalore Urban",
        unit_name: Optional[str] = "Patrol Unit Alpha-1",
        shift_time: Optional[str] = "Night Shift (22:00 - 06:00)"
    ) -> Dict[str, Any]:
        """Generates optimal predictive patrol route for given unit and jurisdiction."""
        # Load crime data to extract hotspots
        df = load_crime_data()
        
        hotspots = []
        if not df.empty:
            # Filter by district if requested
            if district and district.lower() != "all":
                dist_df = df[df['district'].str.contains(district, case=False, na=False)]
                if dist_df.empty:
                    dist_df = df
            else:
                dist_df = df

            # Group crime locations to form risk clusters
            grouped = dist_df.groupby(['latitude', 'longitude']).size().reset_index(name='crime_count')
            grouped = grouped.sort_values(by='crime_count', ascending=False)

            for idx, row in grouped.head(8).iterrows():
                cnt = int(row['crime_count'])
                level = "CRITICAL" if cnt >= 5 else "HIGH" if cnt >= 3 else "MEDIUM"
                risk = min(cnt * 18, 98)
                hotspots.append({
                    "latitude": float(row['latitude']),
                    "longitude": float(row['longitude']),
                    "crime_count": cnt,
                    "risk": risk,
                    "level": level,
                    "district": district or "Bangalore Urban"
                })

        # Fallback hotspots if dataset is small
        if not hotspots:
            hotspots = [
                {"latitude": 12.9716, "longitude": 77.5946, "risk": 88, "level": "CRITICAL", "district": "Bangalore Urban"},
                {"latitude": 12.9784, "longitude": 77.6408, "risk": 75, "level": "HIGH", "district": "Indiranagar"},
                {"latitude": 12.9352, "longitude": 77.6245, "risk": 68, "level": "HIGH", "district": "Koramangala"},
                {"latitude": 12.8399, "longitude": 77.6770, "risk": 62, "level": "MEDIUM", "district": "Electronic City"},
            ]

        # Base Station dispatch coordinates
        base_lat = hotspots[0]["latitude"] if hotspots else 12.9716
        base_lng = hotspots[0]["longitude"] if hotspots else 77.5946
        start_point = {
            "latitude": base_lat,
            "longitude": base_lng
        }

        route_data = self.optimizer.optimize_patrol_route(
            start_point=start_point,
            hotspots=hotspots,
            max_waypoints=6
        )

        return {
            "unit_name": unit_name,
            "shift_time": shift_time,
            "district": district,
            "generated_at": datetime.now().isoformat(),
            "summary": {
                "total_distance_km": route_data["total_distance_km"],
                "estimated_time_mins": route_data["estimated_time_mins"],
                "waypoints_covered": route_data["waypoints_covered"],
                "critical_hotspots_covered": sum(1 for h in hotspots if h["level"] == "CRITICAL")
            },
            "route_points": route_data["route_points"],
            "itinerary": route_data["itinerary"]
        }
