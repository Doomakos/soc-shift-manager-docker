# SOC Shift Manager - Getting Started

This guide helps new users run the app locally without Docker.

## System Requirements
- Python 3.8+
- Node.js 14+
- npm

## 1. Start the Backend

From project root:
```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

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
```

Run backend:
```bash
python app.py
```

Backend endpoint: http://localhost:5000/api

Optional custom port:

Windows PowerShell:
```powershell
$env:PORT=5001
python app.py
```

macOS/Linux:
```bash
PORT=5001 python app.py
```

## 2. Start the Frontend

Open a second terminal in project root:
```bash
cd frontend
npm install
```

If backend is on default port 5000:
```bash
npm start
```

If backend is on a custom port, create frontend/.env first:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

Then run:
```bash
npm start
```

Frontend endpoint: http://localhost:3000

## 3. First-Time Setup in Browser
- Open http://localhost:3000
- If no admin exists, the app opens setup flow
- Create the first administrator account
- Sign in and start configuring users, analysts, shifts, and standby schedules

## Project Layout

```text
soc-shift-manager-docker/
  backend/
    app.py
    init_db.py
    requirements.txt
  frontend/
    src/
    package.json
  docker compose.yml
  README.md
  DOCKER_SETUP.md
```

## Common Tasks

Start backend:
```bash
cd backend
python app.py
```

Start frontend:
```bash
cd frontend
npm start
```

Reset local database:
```bash
cd backend
python init_db.py
```

## Troubleshooting

### Backend does not start
- Check Python version
- Reinstall dependencies with pip install -r requirements.txt
- Ensure virtual environment is active

### Frontend cannot connect
- Ensure backend is running
- Ensure REACT_APP_API_URL points to the active backend port
- Restart frontend after changing frontend/.env

### Port conflict
- Backend: set PORT before python app.py
- Frontend: set PORT before npm start

Windows PowerShell examples:
```powershell
# Backend
$env:PORT=5001
python app.py

# Frontend
$env:PORT=3001
npm start
```

macOS/Linux examples:
```bash
# Backend
PORT=5001 python app.py

# Frontend
PORT=3001 npm start
```

## Next Steps
- For Docker setup, see DOCKER_SETUP.md
- For quick command reference, see QUICK_START.md
