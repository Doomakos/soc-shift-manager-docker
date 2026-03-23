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
COPY entrypoint.sh .

# Make entrypoint executable
RUN chmod +x entrypoint.sh

# Expose port
EXPOSE 5000

# Use entrypoint script to handle setup and startup
ENTRYPOINT ["/app/entrypoint.sh"]
