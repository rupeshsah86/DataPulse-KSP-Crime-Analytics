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
    'host': 'localhost',
    'port': 5432,
    'database': 'datapulse_db',
    'user': 'rupeshmacbook',
    'password': ''
}

def get_db_connection():
    """Get database connection"""
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            database=DB_CONFIG['database'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password']
        )
        return conn
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return None

def load_crime_data():
    """Load crime data from database"""
    try:
        engine = create_engine(
            f"postgresql://{DB_CONFIG['user']}:@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
        )
        query = """
            SELECT 
                id,
                title,
                category,
                severity,
                status,
                incident_date,
                incident_time,
                latitude,
                longitude,
                district,
                city,
                state
            FROM crime_incidents
            WHERE latitude IS NOT NULL 
            AND longitude IS NOT NULL
        """
        df = pd.read_sql(query, engine)
        print(f"✅ Loaded {len(df)} crime records from database")
        return df
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return pd.DataFrame()