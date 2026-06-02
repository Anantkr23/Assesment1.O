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

This repository includes a Render Blueprint in `render.yaml`. After the code is on GitHub, Render can create:

- PostgreSQL database: `assessment-1-db`
- Backend API: `assessment-1-api`
- Frontend site: `assessment-1-frontend`

### Deploy Permanently With GitHub + Render

1. Push this project to a GitHub repository.
2. In Render, choose **New > Blueprint**.
3. Connect the GitHub repository.
4. Select the repository and apply the `render.yaml` blueprint.
5. For a no-cost test deployment, use Render's free plans:
   - Backend web service: `free`
   - PostgreSQL database: `free`
   - Frontend static site: free

Free Render hosting is not permanent production hosting. Free web services spin down when idle, and free PostgreSQL databases expire after 30 days. Upgrade the backend and database plans when you need the app to stay available permanently.

For permanent hosting, use paid Render plans:
   - Backend web service: `starter`
   - PostgreSQL database: `basic-256mb`
   - Frontend static site: can remain static hosting

The blueprint enables automatic deploys on every GitHub commit. The frontend uses `/api`, and Render rewrites `/api` requests to the deployed backend.

Expected live URLs:

- Frontend: `https://assessment-1-frontend.onrender.com`
- Backend API: `https://assessment-1-api.onrender.com`
- API docs: `https://assessment-1-api.onrender.com/docs`

If Render asks you to rename a service because a name is already taken, update these values in `render.yaml`:

- `CORS_ORIGINS`
- frontend route destinations that point to `assessment-1-api.onrender.com`

Alternative hosting setup:

- Database: Neon, Supabase, or Render PostgreSQL
- Backend: Render, Railway, Fly.io, or Koyeb using `backend/Dockerfile`
- Frontend: Render static site using `frontend/`
- Docker image: publish the backend image to Docker Hub or GitHub Container Registry

Set `VITE_API_URL` in the frontend host to the deployed backend URL. Set `CORS_ORIGINS` in the backend host to the deployed frontend URL.

## Required Submission Fields

- GitHub repository link: https://github.com/Anantkr23/Assesment1.O
- Docker image link: https://hub.docker.com/r/anantkr23/assessment1-backend
- Live frontend URL: https://assessment-1-frontend.onrender.com
- Live backend/API docs URL: https://assessment-1-api.onrender.com/docs
