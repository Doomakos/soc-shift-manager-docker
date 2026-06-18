# SOC Shift Manager

SOC Shift Manager is a web application for planning and operating SOC team schedules.

It includes:
- Analyst and user management
- Shift assignment and calendar views
- Standby week planning for L2 analysts
- Team and analyst analytics for operational visibility

## Quick Start (Docker)

This is the easiest way to run the app locally.

### 1. Prerequisites
- Docker Desktop
- Docker Compose (included in Docker Desktop)

### 2. Clone and start
```bash
git clone https://github.com/Doomakos/soc-shift-manager-docker.git
cd soc-shift-manager-docker
docker-compose up --build
```

### 3. Open the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### 4. First login flow
If no administrator exists yet, the app redirects to setup so you can create the first admin account.

## Custom Ports (Docker)

If ports 3000 or 5000 are already in use, create a root .env file:

```env
BACKEND_PORT=5001
FRONTEND_PORT=3001
```

Then start normally:
```bash
docker-compose up --build
```

Access points will be:
- Frontend: http://localhost:3001
- Backend API: http://localhost:5001/api

A sample file is provided at .env.example.

## Local Development Setup (Without Docker)

## 1. Backend
```bash
cd backend
python -m venv venv
```

Activate virtual environment:

Windows PowerShell:
```powershell
venv\Scripts\Activate.ps1
```

macOS/Linux:
```bash
source venv/bin/activate
```

Install dependencies and initialize data:
```bash
pip install -r requirements.txt
python init_db.py
python app.py
```

Backend runs on http://localhost:5000 by default.

To run backend on another port:

Windows PowerShell:
```powershell
$env:PORT=5001
python app.py
```

macOS/Linux:
```bash
PORT=5001 python app.py
```

## 2. Frontend
In a second terminal:
```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:3000 by default.

If backend uses a custom port, create frontend/.env:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Common Commands

Start in background:
```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

Stop services:
```bash
docker-compose down
```

Reset local data:
```bash
docker-compose down -v
docker-compose up --build
```

## Troubleshooting

### Frontend cannot reach backend
- Confirm backend is running
- Confirm backend port matches REACT_APP_API_URL
- If using Docker, confirm BACKEND_PORT in root .env

### Port already in use
- Change BACKEND_PORT and FRONTEND_PORT in root .env
- Restart with docker-compose up --build

### Fresh start
```bash
docker-compose down -v --rmi all
docker-compose up --build
```

## Documentation Map
- DOCKER_SETUP.md: Full Docker setup and operations
- GETTING_STARTED.md: Step-by-step local setup walkthrough
- QUICK_START.md: Short command reference
- PUBLIC_REPO.md: Public repository scope and notes

## Notes
- This repository is intended for local development, testing, and demos.
- Do not store secrets in source control.
