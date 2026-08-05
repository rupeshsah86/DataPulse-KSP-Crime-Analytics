"""
DataPulse - Predictive Patrol Route Optimizer
Uses NetworkX graph algorithms and crime density spatial weighting to optimize police patrol routes.
"""

import math
import networkx as nx
import numpy as np
from typing import List, Dict, Any, Tuple

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers between two lat/lon coordinates."""
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class RouteOptimizer:
    def __init__(self):
        pass

    def optimize_patrol_route(
        self,
        start_point: Dict[str, float],
        hotspots: List[Dict[str, Any]],
        max_waypoints: int = 6
    ) -> Dict[str, Any]:
        """
        Builds a NetworkX spatial graph of crime hotspots and computes an optimal
        risk-weighted patrol route maximizing crime deterrence.
        """
        if not hotspots:
            return {
                "route_points": [start_point],
                "total_distance_km": 0.0,
                "estimated_time_mins": 0,
                "waypoints_covered": 0,
                "itinerary": []
            }

        # 1. Create a complete graph of waypoints including starting station
        nodes = []
        # Add start node (Police Station / Base)
        start_node = {
            "id": 0,
            "name": "Base Station Dispatch",
            "latitude": start_point.get("latitude", 12.9716),
            "longitude": start_point.get("longitude", 77.5946),
            "risk": 10,
            "level": "BASE"
        }
        nodes.append(start_node)

        # Add top priority hotspots (up to max_waypoints)
        sorted_hotspots = sorted(hotspots, key=lambda h: h.get("risk", 0), reverse=True)[:max_waypoints]
        for idx, h in enumerate(sorted_hotspots, start=1):
            nodes.append({
                "id": idx,
                "name": f"Hotspot Zone #{idx} ({h.get('level', 'HIGH')})",
                "latitude": h.get("latitude"),
                "longitude": h.get("longitude"),
                "risk": h.get("risk", 50),
                "level": h.get("level", "HIGH"),
                "district": h.get("district", "Central")
            })

        G = nx.Graph()

        for n in nodes:
            G.add_node(n["id"], **n)

        # Add weighted edges between all pairs of nodes
        for i in range(len(nodes)):
            for j in range(i + 1, len(nodes)):
                n1 = nodes[i]
                n2 = nodes[j]
                dist_km = haversine_distance(
                    n1["latitude"], n1["longitude"],
                    n2["latitude"], n2["longitude"]
                )
                
                # Risk weighting: Higher risk nodes reduce effective weight to prioritize visiting high-risk areas first
                avg_risk = (n1["risk"] + n2["risk"]) / 2.0
                weighted_cost = dist_km / (1.0 + (avg_risk / 50.0))

                G.add_edge(n1["id"], n2["id"], weight=weighted_cost, distance_km=dist_km)

        # 2. Compute Greedy Nearest Neighbor Path starting from node 0
        unvisited = set(range(1, len(nodes)))
        current_node = 0
        ordered_path = [0]
        total_distance_km = 0.0

        while unvisited:
            next_node = min(
                unvisited,
                key=lambda u: G[current_node][u]["weight"]
            )
            total_distance_km += G[current_node][next_node]["distance_km"]
            ordered_path.append(next_node)
            unvisited.remove(next_node)
            current_node = next_node

        # Return to base station to complete loop
        total_distance_km += G[current_node][0]["distance_km"]
        ordered_path.append(0)

        # 3. Format Waypoints & Step-by-Step Itinerary
        route_points = []
        itinerary = []
        cumulative_time = 0

        for step_idx, node_id in enumerate(ordered_path):
            node_data = G.nodes[node_id]

            if step_idx > 0:
                prev_id = ordered_path[step_idx - 1]
                leg_dist = G[prev_id][node_id]["distance_km"]
                drive_time = math.ceil((leg_dist / 35.0) * 60) # Assume 35 km/h urban patrol speed
                patrol_time = 15 if node_data["level"] in ["CRITICAL", "HIGH"] else 10
                if node_id == 0:
                    patrol_time = 0
                cumulative_time += drive_time + patrol_time
            else:
                leg_dist = 0.0
                patrol_time = 0

            route_points.append({
                "step": step_idx + 1,
                "id": node_data["id"],
                "name": node_data["name"],
                "latitude": node_data["latitude"],
                "longitude": node_data["longitude"],
                "risk": node_data["risk"],
                "level": node_data["level"]
            })

            action = (
                "Depot Check-in / Patrol Debrief" if node_id == 0 and step_idx > 0 else
                "Start Patrol Route Dispatch" if node_id == 0 else
                f"High-Visibility Foot Patrol ({patrol_time} mins) & Vehicle Inspection"
            )

            itinerary.append({
                "step": step_idx + 1,
                "location_name": node_data["name"],
                "latitude": node_data["latitude"],
                "longitude": node_data["longitude"],
                "risk_level": node_data["level"],
                "risk_score": node_data["risk"],
                "distance_from_prev_km": round(leg_dist, 2),
                "eta_mins": cumulative_time,
                "recommended_action": action
            })

        return {
            "route_points": route_points,
            "total_distance_km": round(total_distance_km, 2),
            "estimated_time_mins": cumulative_time,
            "waypoints_covered": len(nodes) - 1,
            "itinerary": itinerary
        }
