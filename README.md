# 🚀 TalentHub - Professional Talent Management System

TalentHub is a production-level MERN stack application designed to bridge the gap between elite tech professionals and top-tier recruiters.

## ✨ Features

### 🌐 Frontend (Public)

- **Premium Landing Page**: High-fidelity hero sections and CTA-driven design.
- **Validated Talent Submission**: Real-time form validation using React Hook Form & Zod.
- **Interactive Talent Talent**: Searchable, filterable list with skeleton loading states and debounced search.
- **Glassmorphism UI**: Modern, responsive navigation and specialized design system.

### 🔐 Admin (Protected)

- **Secure Authentication**: JWT-based login with persistent sessions.
- **Dual-View Dashboard**: Toggle between Table and Grid modes for efficient record management.
- **Full CRUD Operations**: Create, update status, and permanently delete records.
- **Universal Search**: Fast, client-side filtering across the entire dashboard.

### ⚙️ Backend (API)

- **Robust Schema Validation**: Request bodies validated using Zod middleware before hitting database.
- **Secure REST API**: Structured endpoints with global error handling and proper HTTP status codes.
- **MongoDB Integration**: Flexible, persistent storage with Mongoose models.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Lucide Icons, Framer Motion, Axios.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Validation/Auth**: Zod, JWT, BcryptJS.

---

## 🚦 Getting Started

### 1. Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Environment Setup

Create a `.env` file in the `/backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_secret
PORT=5000
```

### 3. Installation

```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Running Locally

```powershell
# Start backend (Runs on http://localhost:5000)
cd backend
npm run dev

# Start frontend (Runs on http://localhost:5173)
cd ../frontend
npm run dev
```

---

## 🔐 Admin Credentials (Default)

- **Username**: `admin`
- **Password**: `admin123`

---

## 📦 Deployment Guide

### Frontend (Vercel)

1. Push code to GitHub.
2. Connect to Vercel.
3. Use Build Command: `npm run build`.
4. Use Output Talent: `dist`.

### Backend (Render/Railway)

1. Connect repository.
2. Build Command: `npm install`.
3. Start Command: `node server.js`.
4. Ensure environment variables are added in the provider's dashboard.
# TMS
