# SOC Shift Manager Frontend

Frontend is a React application used for authentication, analyst management, shift operations, standby planning, and analytics.

## Requirements
- Node.js 14+
- npm

## Local Setup

Install dependencies:
```bash
npm install
```

Start development server:
```bash
npm start
```

Default UI URL: http://localhost:3000

## API Configuration

Create frontend/.env:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

If backend port changes, update REACT_APP_API_URL and restart npm start.

## Main Sections
- Home dashboard
- Authentication and profile
- Analyst management
- Shift management
- Standard and advanced calendar views
- Standby management
- Team and analyst analytics
- User management

## Project Structure

```text
frontend/
  public/
    index.html
  src/
    components/
    context/
    pages/
    api.js
    App.jsx
    index.js
    index.css
  package.json
```

## Troubleshooting

Frontend cannot reach API:
- Verify backend is running
- Verify REACT_APP_API_URL value
- Restart frontend after .env changes

Build issues:
- Delete node_modules and run npm install
- Confirm compatible Node.js version
