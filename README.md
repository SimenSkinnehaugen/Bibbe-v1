# Bibbe-v1

This repository contains the backend API and React frontend for the Bibbe project.

## Setup

### 1. Configure environment variables

Copy the example environment files and fill in real values:

```bash
cp driftai_project/Backend/.env.example driftai_project/Backend/.env
cp driftai_project/Frontend/.env.example driftai_project/Frontend/.env
```

**Backend variables** (`driftai_project/Backend/.env`):
- `PORT` – port number for the Express server
- `DATABASE_URL` – connection string for PostgreSQL
- `JWT_SECRET` – secret used for JSON Web Tokens
- `OPENAI_API_KEY` – API key used for AI features
- `FRONTEND_URL` – URL where the frontend is served

**Frontend variables** (`driftai_project/Frontend/.env`):
- `REACT_APP_API_URL` – URL of the backend server

### 2. Install dependencies

Install backend dependencies:

```bash
cd driftai_project
npm install
```

Install frontend dependencies:

```bash
cd Frontend
npm install
```

### 3. Running the apps

Start the backend API (from `driftai_project`):

```bash
npm start
```

Start the React frontend (from `driftai_project/Frontend`):

```bash
npm start
```

The frontend will typically be available on `http://localhost:3000` and the backend on `http://localhost:3001` if using the default environment files.
