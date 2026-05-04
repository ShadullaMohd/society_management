# Society Management System

A complete full-stack web application for managing interactions within a residential society, featuring role-based access for Admins, Residents, and Security personnel.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Axios, Context API, Socket.io Client
- **Backend:** Node.js, Express.js, PostgreSQL, Sequelize, Socket.io
- **Database:** PostgreSQL

## Requirements
- Node.js (v14+)
- PostgreSQL (running locally)

## Setup Instructions

### 1. Database Setup
Ensure PostgreSQL is running and create a database named `society_management`.

```sql
CREATE DATABASE society_management;
```

Update `.env` in `/server` with your DB credentials if they differ from default.

### 2. Backend Setup
```bash
cd server
npm install
npm run db:init # Create the database if it doesn't exist
npm run seed  # To seed the database with Admin, Security, and Residents
npm run dev   # To start server on Port 5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev   # To start React app (usually Port 5173)
```

### 4. Run Both Concurrently
You can run both servers from the root or server folder if configured, but currently please run them in separate terminals for best log visibility.

## Environment Variables (.env)
Create a `.env` file in `server/`:
```
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_NAME=society_management
DB_DIALECT=postgres
JWT_SECRET=supersecretkey123
```

## Default Credentials
All users have password: `123456`

- **Admin:** admin@society.com
- **Security:** security@society.com
- **Residents:** john@society.com, jane@society.com, mike@society.com

## Features
- **Admin:** Dashboard stats, Manage Visitors, Complaints, Announcements, Polls, Marketplace.
- **Resident:** Book Amenities, Pay Maintenance (Simulated), Raise Complaints, Chat in Complaints, Marketplace, Announcements.
- **Security:** Visitor Entry/Exit Management.
- **Real-time:** Socket.io used for visitor alerts, chat, and poll updates.

