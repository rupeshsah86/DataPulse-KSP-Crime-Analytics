"""
Crime Prediction Model - Simple Version (No SciPy Required)
"""

import pandas as pd
import numpy as np
import json
import os

class CrimePredictor:
    def __init__(self):
        self.hotspots = []
        self.crime_data = None
        
    def train(self, crime_data):
        """Train the prediction model using simple grid-based clustering"""
        if crime_data.empty:
            print("❌ No data available for training")
            return []
        
        self.crime_data = crime_data
        locations = crime_data[['latitude', 'longitude']].dropna()
        
        if len(locations) < 3:
            print("❌ Not enough data for training")
            return []
        
        # Simple grid-based clustering (no SciPy needed!)
        hotspots = []
        grid_size = 0.02  # ~2km
        
        for lat in np.arange(12.8, 13.1, grid_size):
            for lng in np.arange(77.4, 77.8, grid_size):
                cluster = locations[
                    (locations['latitude'] >= lat) & 
                    (locations['latitude'] < lat + grid_size) &
                    (locations['longitude'] >= lng) & 
                    (locations['longitude'] < lng + grid_size)
                ]
                if len(cluster) >= 2:
                    center_lat = cluster['latitude'].mean()
                    center_lng = cluster['longitude'].mean()
                    risk = min(100, len(cluster) * 20 + 10)
                    
                    if risk > 75:
                        level = "CRITICAL"
                    elif risk > 50:
                        level = "HIGH"
                    elif risk > 25:
                        level = "MEDIUM"
                    else:
                        level = "LOW"
                    
                    hotspots.append({
                        'latitude': round(center_lat, 6),
                        'longitude': round(center_lng, 6),
                        'risk': risk,
                        'level': level,
                        'crime_count': len(cluster)
                    })
        
        self.hotspots = sorted(hotspots, key=lambda x: x['risk'], reverse=True)
        print(f"✅ Found {len(self.hotspots)} crime hotspots")
        return self.hotspots
    
    def predict_risk(self, latitude, longitude):
        """Predict risk for a specific location"""
        if not self.hotspots:
            return 0, "LOW"
        
        # Find nearest hotspot
        min_distance = float('inf')
        risk = 0
        level = "LOW"
        
        for hotspot in self.hotspots:
            distance = ((latitude - hotspot['latitude']) ** 2 + 
                       (longitude - hotspot['longitude']) ** 2) ** 0.5
            if distance < min_distance:
                min_distance = distance
                risk = hotspot['risk']
                level = hotspot['level']
        
        # Reduce risk based on distance
        risk = max(0, risk - min_distance * 100)
        
        if risk > 75:
            level = "CRITICAL"
        elif risk > 50:
            level = "HIGH"
        elif risk > 25:
            level = "MEDIUM"
        else:
            level = "LOW"
            
        return max(0, min(100, risk)), level
    
    def save_model(self, path='models/crime_predictor.json'):
        """Save the trained model as JSON"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            json.dump({'hotspots': self.hotspots}, f)
        print(f"✅ Model saved to {path}")
    
    def load_model(self, path='models/crime_predictor.json'):
        """Load a trained model"""
        try:
            with open(path, 'r') as f:
                data = json.load(f)
                self.hotspots = data.get('hotspots', [])
            print(f"✅ Model loaded from {path}")
            return True
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return False