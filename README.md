# Employee Management System

A full-stack employee management system built with React, GraphQL, and Node.js.

## Project Structure

```
.
├── frontend/          # React frontend application
├── backend/          # Node.js + GraphQL backend
└── README.md         # This file
```

## Features

### Frontend
- Responsive design with hamburger menu and horizontal navigation
- Grid and tile views for employee data
- Detailed employee view with expandable tiles
- Modern UI with smooth transitions

### Backend
- GraphQL API with Node.js
- Role-based authentication (Admin/Employee)
- Pagination and sorting
- Performance optimized queries

## Tech Stack

### Frontend
- React
- GraphQL Client (Apollo Client)
- CSS/SCSS
- Material-UI

### Backend
- Node.js
- Express
- GraphQL
- MongoDB
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Follow the `.env.example` files for required variables

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

## API Documentation

The GraphQL API documentation will be available at `/graphql` when running the backend server.

## License

MIT 