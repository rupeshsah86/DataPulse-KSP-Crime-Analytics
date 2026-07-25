"""
Data Loader Service
Loads crime data from PostgreSQL for AI analysis
"""

import pandas as pd
import psycopg2
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'datapulse_db'),
    'user': os.getenv('DB_USER', ''),
    'password': os.getenv('DB_PASSWORD', '')
}

def create_sample_data():
    """Create sample crime data for demo"""
    print("📊 Creating sample data for AI...")
    data = {
        'id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'title': ['Bank Robbery', 'Cyber Fraud', 'Murder', 'Vehicle Theft', 'Domestic Violence',
                  'Robbery', 'Burglary', 'Drug Trafficking', 'Kidnapping', 'Financial Fraud'],
        'category': ['ROBBERY', 'CYBER_CRIME', 'MURDER', 'VEHICLE_THEFT', 'DOMESTIC_VIOLENCE',
                     'ROBBERY', 'BURGLARY', 'DRUG_OFFENSE', 'KIDNAPPING', 'FRAUD'],
        'severity': ['CRITICAL', 'HIGH', 'CRITICAL', 'MEDIUM', 'HIGH',
                     'HIGH', 'MEDIUM', 'CRITICAL', 'CRITICAL', 'HIGH'],
        'district': ['Bangalore Urban', 'Bangalore Urban', 'Mysore', 'Hubli', 'Bangalore Urban',
                     'Bangalore Urban', 'Bangalore Urban', 'Bangalore Urban', 'Bangalore Urban', 'Mangalore'],
        'status': ['OPEN', 'INVESTIGATING', 'OPEN', 'OPEN', 'INVESTIGATING',
                   'OPEN', 'INVESTIGATING', 'OPEN', 'INVESTIGATING', 'OPEN'],
        'incident_date': ['2026-07-20', '2026-07-19', '2026-07-18', '2026-07-17', '2026-07-16',
                          '2026-07-15', '2026-07-14', '2026-07-13', '2026-07-12', '2026-07-11'],
        'latitude': [12.9698, 12.8354, 12.3092, 15.3647, 12.9352,
                     12.9784, 12.9288, 12.9716, 13.0027, 12.9141],
        'longitude': [77.7499, 77.6794, 76.6532, 75.1239, 77.6245,
                      77.6408, 77.6105, 77.5946, 77.5700, 74.8560]
    }
    return pd.DataFrame(data)

def load_crime_data():
    """Load crime data from database or use sample data"""
    try:
        connection_string = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
        engine = create_engine(connection_string)
        
        query = """
            SELECT 
                id, title, category, severity, status, incident_date,
                latitude, longitude, district, city, state
            FROM crime_incidents
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
            ORDER BY incident_date DESC
            LIMIT 1000
        """
        
        df = pd.read_sql(query, engine)
        print(f"✅ Loaded {len(df)} crime records from database")
        return df
        
    except Exception as e:
        print(f"⚠️ Database error: {e}")
        print("📊 Using sample data instead")
        return create_sample_data()
