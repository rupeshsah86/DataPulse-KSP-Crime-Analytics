"""
RAG Service - Retrieval Augmented Generation for Crime Data
"""

import os
import pandas as pd
import psycopg2
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'datapulse_db'),
    'user': os.getenv('DB_USER', 'rupeshmacbook'),
    'password': os.getenv('DB_PASSWORD', '')
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
    """Load crime data from database for RAG"""
    try:
        engine = create_engine(
            f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
        )
        query = """
            SELECT 
                id,
                title,
                description,
                category,
                severity,
                status,
                incident_date,
                district,
                city,
                state,
                reported_by,
                police_station
            FROM crime_incidents
            ORDER BY incident_date DESC
            LIMIT 500
        """
        df = pd.read_sql(query, engine)
        print(f"✅ Loaded {len(df)} crime records for RAG")
        return df
    except Exception as e:
        print(f"❌ Error loading data: {e}")
        return pd.DataFrame()

def format_crime_text(crime):
    """Format a crime record as text for embeddings"""
    return f"""
Crime: {crime.get('title', 'N/A')}
Category: {crime.get('category', 'N/A')}
Severity: {crime.get('severity', 'N/A')}
Status: {crime.get('status', 'N/A')}
District: {crime.get('district', 'N/A')}
City: {crime.get('city', 'N/A')}
State: {crime.get('state', 'N/A')}
Date: {crime.get('incident_date', 'N/A')}
Reported By: {crime.get('reported_by', 'N/A')}
Police Station: {crime.get('police_station', 'N/A')}
Description: {crime.get('description', 'No description')}
"""