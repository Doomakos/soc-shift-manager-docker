"""
SOC Shift Manager - Database Initialization Script
Creates the database schema. No sample data is inserted.
"""

from app import app, db


def init_db():
    """Create all database tables with an empty schema."""
    with app.app_context():
        db.create_all()
        print("? Database schema created (empty, ready for first-run setup)")


if __name__ == "__main__":
    init_db()
