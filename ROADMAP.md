# SOC Shift Manager Roadmap

## Current Focus
- Stable local setup for new users
- Role-based access and account lifecycle
- Reliable shift and standby planning workflows
- Improved analytics and operational reporting

## Completed

Backend:
- Analyst CRUD
- Shift CRUD
- Standby endpoints
- Authentication endpoints
- Analytics endpoints
- Database initialization and sample data

Frontend:
- Login and setup flows
- Analyst, shift, standby, and user management pages
- Calendar views
- Analytics pages
- Protected routes and role-aware navigation

Platform:
- Dockerized backend/frontend
- Configurable backend and frontend ports
- Centralized API URL handling in frontend

## Next Improvements

Security:
- Harden token/session handling
- Add stricter CORS policy by environment
- Add request validation coverage

Quality:
- Backend unit/integration tests
- Frontend component and end-to-end tests
- CI checks for lint/test/build

User Experience:
- Better onboarding copy in app
- Stronger empty states and validation messages
- Faster load performance on large datasets

Operations:
- Structured logging and diagnostics
- Export/import tooling
- Deployment playbooks for staging/production

## Proposed Milestones

Milestone 1:
- Complete auth hardening
- Add backend test baseline

Milestone 2:
- Add frontend test baseline
- Add CI pipeline for pull requests

Milestone 3:
- Add operational tooling and deployment documentation

## Notes
- Keep docs aligned with runtime behavior and environment variables.
- Prefer one source of truth for setup instructions in root README.
