# SOC Shift Manager - Quick Start

## Fastest Setup (Docker)

```bash
git clone https://github.com/Doomakos/soc-shift-manager-docker.git
cd soc-shift-manager-docker
docker-compose up --build
```

Open:
- Frontend: http://localhost:3000
- API: http://localhost:5000/api

## If Ports Are Busy

Create .env in project root:

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

Start again:
```bash
docker-compose up --build
```

## Useful Commands

Start (detached):
```bash
docker-compose up -d
```

Logs:
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

Stop:
```bash
docker-compose down
```

Reset data:
```bash
docker-compose down -v
docker-compose up --build
```

## First Run
- Open the frontend URL
- Complete admin setup if prompted
- Sign in and begin managing users, analysts, shifts, and standby schedules

## Need More Detail?
- README.md
- DOCKER_SETUP.md
- GETTING_STARTED.md
