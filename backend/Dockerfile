# Backend Dockerfile for SOC Shift Manager
FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .

# Install pip packages (with SSL workaround for certain environments)
RUN pip install --no-cache-dir --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt

# Copy application code
COPY app.py .
COPY init_db.py .

# Expose port
EXPOSE 5000

# Initialize database with sample data and start the app
# Create instance directory at runtime (after volume mount)
CMD mkdir -p instance && python init_db.py && python app.py
