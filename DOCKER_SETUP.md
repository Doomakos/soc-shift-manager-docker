# Docker Setup for SOC Shift Manager

This guide is for users who want a reliable local setup with minimal manual steps.

## Prerequisites
- Docker Desktop
- Docker Compose

## 1. Clone Repository
```bash
git clone https://github.com/Doomakos/soc-shift-manager-docker.git
cd soc-shift-manager-docker
```

## 2. Optional Port Configuration

If default ports are available, skip this step.

If ports are in use, create .env in project root:

Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

macOS/Linux:
```bash
cp .env.example .env
```

```env
BACKEND_PORT=5001
FRONTEND_PORT=3001
```

A sample file is available as .env.example.

## 3. Start Application
```bash
docker compose up --build
```

This will:
- Build backend and frontend images
- Initialize local database
- Start both services

## 4. Access the App
- Frontend: http://localhost:3000 (or FRONTEND_PORT)
- Backend API: http://localhost:5000/api (or BACKEND_PORT)

## 5. Stop the App
```bash
docker compose down
```

## Operations

Run in background:
```bash
docker compose up -d
```

View logs:
```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

Restart services:
```bash
docker compose restart
```

Rebuild images:
```bash
docker compose up --build
```

Reset local data:
```bash
docker compose down -v
docker compose up --build
```

## Troubleshooting

### Frontend not loading
- Wait for frontend build to complete
- Check frontend logs
- Refresh browser

### Backend API not reachable
- Check backend logs
- Confirm backend port in .env if customized
- Confirm REACT_APP_API_URL is set correctly if running frontend outside Docker

### Full reset
```bash
docker compose down -v --rmi all
docker compose up --build
```

## Security Note
This setup is intended for local development and demos.
