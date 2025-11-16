"""
Authentication utilities for E-Tongue API
"""
import sqlite3
import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from typing import Optional, Tuple

# JWT secret key (in production, use environment variable)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "e-tongue-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Database file
DB_FILE = "users.db"


def init_db():
    """Initialize SQLite database for users"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against a hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))


def create_user(email: str, password: str, name: Optional[str] = None) -> Tuple[bool, str]:
    """
    Create a new user
    
    Returns:
        (success: bool, message: str)
    """
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            conn.close()
            return False, "User with this email already exists"
        
        # Hash password
        password_hash = hash_password(password)
        
        # Insert user
        cursor.execute(
            "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
            (email, password_hash, name or email.split('@')[0])
        )
        
        conn.commit()
        conn.close()
        
        return True, "User created successfully"
    
    except Exception as e:
        return False, f"Error creating user: {str(e)}"


def authenticate_user(email: str, password: str) -> Tuple[bool, Optional[dict]]:
    """
    Authenticate a user with email and password
    
    Returns:
        (success: bool, user_data: dict or None)
    """
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Get user
        cursor.execute("SELECT id, email, password_hash, name FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return False, None
        
        user_id, user_email, password_hash, user_name = user
        
        # Verify password
        if not verify_password(password, password_hash):
            return False, None
        
        return True, {
            "id": user_id,
            "email": user_email,
            "name": user_name
        }
    
    except Exception as e:
        return False, None


def generate_token(user_data: dict) -> str:
    """
    Generate JWT token for a user
    
    Args:
        user_data: Dictionary with user information (id, email, name)
    
    Returns:
        JWT token string
    """
    payload = {
        "user_id": user_data["id"],
        "email": user_data["email"],
        "name": user_data.get("name", ""),
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow()
    }
    
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token


def verify_token(token: str) -> Optional[dict]:
    """
    Verify and decode JWT token
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded payload or None if invalid
    """
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_user_by_id(user_id: int) -> Optional[dict]:
    """Get user by ID"""
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, email, name FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        if not user:
            return None
        
        return {
            "id": user[0],
            "email": user[1],
            "name": user[2]
        }
    except Exception:
        return None

