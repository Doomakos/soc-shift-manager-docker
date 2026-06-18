# Public Repository Notes

This repository is the public Docker-ready version of SOC Shift Manager.

## Included
- Application source code
- Docker setup for local deployment
- Database initialization scripts
- End-user setup documentation

## Excluded
- Production databases
- Private credentials
- Internal backups
- Environment-specific private assets

## Quick Start
```bash
git clone https://github.com/Doomakos/soc-shift-manager-docker.git
cd soc-shift-manager-docker
docker-compose up --build
```

Then open:
- Frontend: http://localhost:3000
- API: http://localhost:5000/api

For port overrides, set BACKEND_PORT and FRONTEND_PORT in root .env.

## Documentation
- README.md
- DOCKER_SETUP.md
- GETTING_STARTED.md
- QUICK_START.md
