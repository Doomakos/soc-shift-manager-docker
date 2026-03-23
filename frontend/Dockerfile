# Frontend Dockerfile for SOC Shift Manager
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY public/ ./public/
COPY src/ ./src/
COPY tailwind.config.js .
COPY postcss.config.js .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "start"]
