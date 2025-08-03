#!/bin/bash

# Shell AI ESG Contract Analyzer - Project Setup Script
# This script creates the complete project structure and placeholder files

echo "🚀 Setting up Shell AI ESG Contract Analyzer Project..."

# Create main project directory on Desktop
PROJECT_ROOT="$HOME/Desktop/SHELL AI ESG"
mkdir -p "$PROJECT_ROOT"
cd "$PROJECT_ROOT"

echo "📁 Creating project structure..."

# Create directory structure
directories=(
    "backend/src/modules/auth/dto"
    "backend/src/modules/auth/guards"
    "backend/src/modules/auth/strategies"
    "backend/src/modules/contracts/dto"
    "backend/src/modules/contracts/entities"
    "backend/src/modules/esg/dto"
    "backend/src/modules/esg/interfaces"
    "backend/src/modules/nlp/interfaces"
    "backend/src/modules/users/entities"
    "backend/src/modules/monitoring"
    "backend/src/common/filters"
    "backend/src/common/interceptors"
    "backend/src/config"
    "backend/test/unit"
    "backend/test/integration"
    "backend/test/e2e"
    "frontend/src/components/auth"
    "frontend/src/components/layout"
    "frontend/src/components/dashboard"
    "frontend/src/components/contracts"
    "frontend/src/components/analysis"
    "frontend/src/contexts"
    "frontend/src/services"
    "frontend/src/hooks"
    "frontend/src/utils"
    "frontend/src/types"
    "frontend/public"
    ".github/workflows"
    "infrastructure/terraform"
    "infrastructure/kubernetes"
    "helm/shell-esg-analyzer/templates"
    "docker/backend"
    "docker/frontend"
    "docker/nginx"
    "scripts"
    "docs"
)

for dir in "${directories[@]}"; do
    mkdir -p "$dir"
done

echo "📝 Creating essential files..."

# Create README.md
cat > README.md << 'EOF'
# Shell AI ESG Contract Analyzer

## Overview
Advanced AI-powered system for analyzing ESG (Environmental, Social, and Governance) compliance in contracts.

## Quick Start
```bash
# Install dependencies
npm install

# Start development environment
docker-compose up -d

# Run tests
npm test
```

## Architecture
- **Backend**: NestJS + PostgreSQL + Redis
- **Frontend**: React + TypeScript + Tailwind CSS
- **AI/ML**: OpenAI GPT-4 for NLP analysis
- **Infrastructure**: Kubernetes + AWS EKS

## Documentation
See `/docs` folder for detailed documentation.

## License
© 2024 Shell. All rights reserved.
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output

# Production
build/
dist/
*.log

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Docker
docker-compose.override.yml

# Terraform
*.tfstate
*.tfstate.*
.terraform/
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: esguser
      POSTGRES_PASSWORD: esgpass
      POSTGRES_DB: esgdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass redispass

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://esguser:esgpass@postgres:5432/esgdb
      REDIS_URL: redis://:redispass@redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3000
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
EOF

# Create package.json for root
cat > package.json << 'EOF'
{
  "name": "shell-ai-esg-contract-analyzer",
  "version": "1.0.0",
  "description": "AI-powered ESG contract analysis system",
  "private": true,
  "workspaces": [
    "backend",
    "frontend"
  ],
  "scripts": {
    "dev": "docker-compose up",
    "build": "docker-compose build",
    "test": "npm run test:backend && npm run test:frontend",
    "test:backend": "cd backend && npm test",
    "test:frontend": "cd frontend && npm test",
    "lint": "npm run lint:backend && npm run lint:frontend",
    "lint:backend": "cd backend && npm run lint",
    "lint:frontend": "cd frontend && npm run lint"
  },
  "keywords": ["esg", "ai", "contract-analysis", "shell"],
  "author": "Shell Digital",
  "license": "PROPRIETARY"
}
EOF

# Create backend package.json
cat > backend/package.json << 'EOF'
{
  "name": "shell-esg-backend",
  "version": "1.0.0",
  "description": "Backend for Shell AI ESG Contract Analyzer",
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@nestjs/cache-manager": "^2.0.0",
    "@nestjs/axios": "^3.0.0",
    "typeorm": "^0.3.0",
    "pg": "^8.11.0",
    "bcrypt": "^5.1.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "cache-manager": "^5.0.0",
    "cache-manager-redis-store": "^3.0.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "passport-google-oauth20": "^2.0.0",
    "passport-microsoft": "^1.0.0",
    "openai": "^4.0.0",
    "pdfkit": "^0.13.0",
    "bull": "^4.0.0",
    "otplib": "^12.0.0",
    "qrcode": "^1.5.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/node": "^20.0.0",
    "@types/jest": "^29.0.0",
    "@types/bcrypt": "^5.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Create frontend package.json
cat > frontend/package.json << 'EOF'
{
  "name": "shell-esg-frontend",
  "version": "1.0.0",
  "description": "Frontend for Shell AI ESG Contract Analyzer",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "recharts": "^2.5.0",
    "axios": "^1.5.0",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.21",
    "react-hook-form": "^7.45.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hot-toast": "^2.4.0",
    "framer-motion": "^10.16.0",
    "@tanstack/react-query": "^4.35.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/lodash": "^4.14.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "vitest": "^0.34.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}
EOF

# Create test file placeholders
echo "Creating test files..."
touch backend/test/unit/esgAnalyzer.service.test.ts
touch backend/test/unit/nlp.service.test.ts
touch backend/test/unit/auth.controller.test.ts

# Create component placeholders
echo "Creating component files..."
touch frontend/src/components/auth/Login.tsx
touch frontend/src/components/layout/Layout.tsx

# Create CI/CD workflow
touch .github/workflows/ci-cd.yml

# Create deployment guide
touch docs/DEPLOYMENT_GUIDE.md

# Create environment file templates
cat > backend/.env.example << 'EOF'
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://esguser:esgpass@localhost:5432/esgdb

# Redis
REDIS_URL=redis://:redispass@localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EOF

cat > frontend/.env.example << 'EOF'
VITE_API_URL=http://localhost:3000
VITE_ENVIRONMENT=development
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_MICROSOFT_CLIENT_ID=your-microsoft-client-id
EOF

# Create a setup instructions file
cat > SETUP_INSTRUCTIONS.md << 'EOF'
# Shell AI ESG Contract Analyzer - Setup Instructions

## 📋 Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

## 🚀 Quick Setup

1. **Clone or copy all files to the project directory**

2. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit both .env files with your actual values
   ```

4. **Start the development environment:**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations:**
   ```bash
   cd backend
   npm run migration:run
   ```

6. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/api/docs

## 📁 Project Structure
- `/backend` - NestJS backend application
- `/frontend` - React frontend application
- `/infrastructure` - Terraform and Kubernetes configs
- `/helm` - Helm charts for deployment
- `/docs` - Documentation
- `/.github/workflows` - CI/CD pipelines

## 🧪 Running Tests
```bash
# All tests
npm test

# Backend tests
npm run test:backend

# Frontend tests
npm run test:frontend
```

## 📚 Next Steps
1. Copy the test files content from the artifacts
2. Copy the component files content from the artifacts
3. Copy the CI/CD workflow from the artifacts
4. Review and customize the configuration files
5. Set up your cloud infrastructure using Terraform

For detailed deployment instructions, see `/docs/DEPLOYMENT_GUIDE.md`
EOF

echo "✅ Project structure created successfully!"
echo "📍 Location: $PROJECT_ROOT"
echo ""
echo "📋 Next steps:"
echo "1. Navigate to: cd \"$PROJECT_ROOT\""
echo "2. Copy the content from the artifacts to the respective files:"
echo "   - Test files → backend/test/unit/"
echo "   - Components → frontend/src/components/"
echo "   - CI/CD → .github/workflows/ci-cd.yml"
echo "   - Deployment Guide → docs/DEPLOYMENT_GUIDE.md"
echo "3. Follow the instructions in SETUP_INSTRUCTIONS.md"
echo ""
echo "🎉 Your Shell AI ESG Contract Analyzer project is ready!"