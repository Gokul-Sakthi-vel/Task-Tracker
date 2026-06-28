# TaskTracker — MERN Stack Task Management App

A responsive, high-performance, production-ready MERN Stack Task Tracker application. Built with React (Vite) on the frontend and Node.js + Express.js + MongoDB on the backend. This project incorporates a custom CSS variables design system, glassmorphism UI structures, state persistence in the URL query string, and automated date highlights.

---

## Folder Structure

```text
task-tracker/
├── backend/
│   ├── controllers/
│   │   └── taskController.js   # Route controllers
│   ├── middleware/
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/
│   │   └── Task.js             # Mongoose task model
│   ├── routes/
│   │   └── tasks.js            # Express routers
│   ├── .env                    # Backend config
│   ├── server.js               # Entrypoint script
│   └── package.json            # Backend packages
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── taskApi.js      # Axios clients
    │   ├── components/
    │   │   ├── FilterBar.jsx   # Search & Filters
    │   │   ├── Navbar.jsx      # Navigation header
    │   │   ├── TaskCard.jsx    # Individual card
    │   │   ├── TaskForm.jsx    # Modal edit/create form
    │   │   └── TaskList.jsx    # Grid manager & loaders
    │   ├── pages/
    │   │   └── Home.jsx        # Coordinator view
    │   ├── App.jsx             # Main Router wrapper
    │   ├── index.css           # Premium styling & theme
    │   └── main.jsx            # Mounting file
    ├── .env                    # Frontend config
    ├── index.html              # HTML shell
    ├── vite.config.js          # Vite config
    └── package.json            # Frontend packages
```

---

## Key Features

1. **Dashboard Stats**: Real-time total, pending, in-progress, and completed counters.
2. **Dynamic UI updates**: Instantly syncs mutations (create, edit, delete) to the screen without full page reloads.
3. **URL Sync**: Keeps search inputs, sorting parameters, and filter dropdowns in sync with React Router's search parameters so filters survive page updates.
4. **Visual Indicators**: Overdue task dates are flagged in Red, and today's due dates are flagged in Orange.
5. **Robust Error Handling**: Express backend captures DB cast, duplicate key, and schema validation issues and formats them into clean JSON error bodies.

---

## API Documentation

All routes reside under `/api/tasks` prefix.

| Method | Endpoint | Query Filters | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | `?status=`, `?priority=` | Retrieve all tasks. Supports filtering by status & priority. |
| **GET** | `/api/tasks/:id` | *None* | Get details of a single task. |
| **POST** | `/api/tasks` | *None* | Create a task. Returns the newly created task body. |
| **PUT** | `/api/tasks/:id` | *None* | Update task by ID (validates Schema bounds). |
| **DELETE** | `/api/tasks/:id` | *None* | Remove task by ID. |

### Task Model Schema
- `title` (String, required, max 100 characters)
- `description` (String, optional, max 500 characters)
- `status` (String, enum: `["pending", "in-progress", "completed"]`, default: `pending`)
- `priority` (String, enum: `["low", "medium", "high"]`, default: `medium`)
- `dueDate` (Date, optional)
- `createdAt` (Date, auto-generated timestamp)

---

## Setup & Running Locally

### Prerequisites
- Node.js installed (v18+ recommended)
- MongoDB instance running locally (e.g. `mongodb://localhost:27017`) or a remote MongoDB Atlas URI.

### Running with a Single Command (Recommended)
1. Install root dependencies if not already done:
   ```bash
   npm install
   ```
2. Start both servers concurrently using the single command:
   ```bash
   npm run dev
   ```
   *This starts the Express server (port 5000) and the Vite frontend (port 5173) simultaneously. Logs from both processes will output in the same terminal.*
3. Open `http://localhost:5173` in your browser.

---

### Alternative: Manual Step-by-Step Start
If you prefer running them in separate terminals:

#### Start Backend
```bash
cd backend
npm install
npm run dev
```

#### Start Frontend
```bash
cd ../frontend
npm install
npm run dev
```
5. Open your browser and navigate to `http://localhost:5173`.

---

## Deployment Steps

### Backend → Deploy to Render

1. Create a Web Service on Render.
2. Link your GitHub repository.
3. Configure the build parameters:
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `node backend/server.js`
4. Set Environment Variables in Render:
   - `MONGO_URI`: Your production MongoDB connection string (e.g. Atlas URI)
   - `PORT`: `10000` (or leave default, Render supplies this automatically)
   - `FRONTEND_URL`: `https://your-vercel-frontend-url.vercel.app` (for CORS security)
   - `NODE_ENV`: `production`

---

### Frontend → Deploy to Vercel

1. Create a project on Vercel and link your GitHub repository.
2. Configure the build parameters:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Set Environment Variables in Vercel:
   - `VITE_API_URL`: `https://your-render-backend-url.onrender.com/api` (URL of your deployed backend service)
