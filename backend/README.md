# SOC Shift Manager Backend

Backend service is a Flask API responsible for users, analysts, shifts, standby scheduling, and analytics.

## Requirements
- Python 3.8+

## Local Setup

```bash
python -m venv venv
```

Activate environment.

Windows PowerShell:
```powershell
venv\Scripts\Activate.ps1
```

macOS/Linux:
```bash
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Initialize sample data:
```bash
python init_db.py
```

Run API:
```bash
python app.py
```

Default API base: http://localhost:5000/api

## Custom Backend Port

Windows PowerShell:
```powershell
$env:PORT=5001
python app.py
```

macOS/Linux:
```bash
PORT=5001 python app.py
```

## Key Endpoints

System:
- GET /api/health
- POST /api/init

Auth:
- GET /api/auth/setup
- POST /api/auth/setup
- POST /api/auth/login
- POST /api/auth/refresh

Analysts:
- GET /api/analysts
- POST /api/analysts
- GET /api/analysts/{id}
- PUT /api/analysts/{id}
- DELETE /api/analysts/{id}

Shifts:
- GET /api/shifts
- POST /api/shifts
- GET /api/shifts/{id}
- PUT /api/shifts/{id}
- DELETE /api/shifts/{id}

Standby:
- GET /api/standby
- POST /api/standby
- PUT /api/standby/{id}
- DELETE /api/standby/{id}

Analytics:
- GET /api/analytics/team-summary
- GET /api/analytics/analyst-summary/{id}

## Environment Variables

Create backend/.env as needed:

```env
DATABASE_URL=sqlite:///soc_shift_manager.db
FLASK_ENV=development
JWT_SECRET_KEY=replace-this-in-real-environments
PORT=5000
```

## Troubleshooting

API does not start:
- Verify Python version
- Verify venv is active
- Reinstall dependencies

Database issues:
- Re-run python init_db.py
- Check file permissions in backend instance directory

Connection issues from frontend:
- Confirm frontend API URL targets correct backend port
