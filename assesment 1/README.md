# Inventory & Order Management System

A simplified full-stack system for managing products, customers, orders, and inventory tracking.

## Features

- Product management with unique SKUs
- Customer management with unique email addresses
- Order creation with stock validation
- Automatic inventory reduction when orders are placed
- PostgreSQL persistence
- FastAPI backend
- Responsive React frontend
- Docker and Docker Compose configuration
- Environment-based configuration

## Project Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Run With Docker Compose

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Start the services:

```bash
docker compose up --build
```

3. Open the app:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Backend:

- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ORIGINS`: comma-separated allowed frontend origins

Frontend:

- `VITE_API_URL`: public backend API URL

## Deployment Notes

Suggested free-hosting setup:

- Database: Neon, Supabase, or Render PostgreSQL
- Backend: Render, Railway, Fly.io, or Koyeb using `backend/Dockerfile`
- Frontend: Vercel, Netlify, or Render static site using `frontend/`
- Docker image: publish the backend image to Docker Hub or GitHub Container Registry

Set `VITE_API_URL` in the frontend host to the deployed backend URL. Set `CORS_ORIGINS` in the backend host to the deployed frontend URL.

## Required Submission Fields

- GitHub repository link: add after pushing the repository
- Docker image link: add after publishing the backend image
- Live frontend URL: add after deployment
- Live backend/API docs URL: add after deployment
