# To-Do List App (React + Express + MongoDB)

This is my To-Do List app. The frontend is built with React and the backend is built with Node.js, Express and MongoDB. The React app talks to the backend using Axios, so the tasks are saved in a real database and stay there after a refresh.

**Live links**

- 
- Backend API (Render): [PASTE YOUR RENDER LINK HERE](https://tutedude-todo-11lg.onrender.com/)


The backend runs on Render's free plan, so it goes to sleep when nobody uses it. The first load can take up to a minute. After that it works normally.

## What the app can do

- Add a task with a title, description and due date
- Edit a task
- Delete a task
- Mark a task as done or not done
- Filter tasks by pending or completed
- Search tasks by title
- Shows a loading message while data is coming in
- Shows an error message if something goes wrong (for example if the server is down)

## Tech used

- Frontend: React (Vite), Axios, plain CSS
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- Hosting: Netlify (frontend) and Render (backend)



## How to run it on your computer

You need Node.js and a free MongoDB Atlas account.

### 1. Backend

```bash
cd backend
npm install
```

Create a file called `.env` inside the `backend` folder with these three lines:

```
PORT=5000
MONGO_URI=your MongoDB Atlas connection string
CLIENT_URL=http://localhost:5173
```

Then start it:

```bash
npm run dev
```

You should see "MongoDB connected" and "Server running on port 5000".

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a file called `.env` inside the `frontend` folder:

```
VITE_API_URL=http://localhost:5000/api
```

Then start it:

```bash
npm run dev
```

Open http://localhost:5173 in the browser. Keep both terminals running. If you change a `.env` file, stop the app and start it again so the new value loads.

## Environment variables

| Where | Name | What it is |
|---|---|---|
| Backend | PORT | Port for the server (Render sets this by itself) |
| Backend | MONGO_URI | MongoDB Atlas connection string |
| Backend | CLIENT_URL | The frontend link, used for CORS (no slash at the end) |
| Frontend | VITE_API_URL | The backend API link, ending with /api |

The `.env` files are not on GitHub because they have my database password in them.

## API endpoints

| Method | URL | What it does |
|---|---|---|
| POST | /api/tasks | Add a task |
| GET | /api/tasks | Get all tasks (can use ?status= and ?search=) |
| GET | /api/tasks/:id | Get one task |
| PUT | /api/tasks/:id | Edit a task |
| PATCH | /api/tasks/:id | Mark done or not done |
| DELETE | /api/tasks/:id | Delete a task |

## How the frontend and backend are connected

All the API calls are in one file, `frontend/src/api/taskApi.js`. It makes one Axios instance that uses the `VITE_API_URL` value, so if the backend link changes I only have to change it in one place.

The task list is kept in React state with `useState` in `App.jsx`. When the page opens, `useEffect` loads the tasks from the API. After each add, edit, delete or tick, the app waits for the server to say it worked and then updates the list on screen, so the page changes right away without a reload. Search has a short delay so it does not call the API on every key press.

Errors from the server are turned into a simple message and shown in a red box at the top of the list.

## How it was deployed

1. Pushed the whole project to GitHub (without the `.env` files).
2. Backend on Render as a **Web Service**. Root directory `backend`, build command `npm install`, start command `npm start`. Added the `MONGO_URI` and `CLIENT_URL` variables there.
3. Frontend on Netlify. Base directory `frontend`, build command `npm run build`, publish directory `dist`. Added `VITE_API_URL` pointing to the Render link.
4. Went back to Render and set `CLIENT_URL` to the Netlify link so the browser is allowed to call the API.

## Challenges I faced

Keep only the ones that really happened to you, and say them in your own words.

- **MongoDB connection error (querySrv ECONNREFUSED).** My computer could not look up the Atlas address. I fixed it by setting the DNS servers to Google DNS in the code.
- **Environment variables not loading.** The terminal said it loaded 0 variables. The `.env` file was in the wrong place, so I moved it next to `package.json`.
- **Render deploy failing.** I first made a Static Site, but the backend needs a Web Service. After that, the start command was wrong (`node express.js`), so I changed it to `npm start`.
- **Atlas blocking Render (SSL error).** The database rejected the connection from Render until I allowed all IP addresses (0.0.0.0/0) in Network Access.
- **CORS errors.** The browser blocked requests from the frontend until I set `CLIENT_URL` on the backend to the exact frontend link.
- **Keeping the list in sync.** After editing or ticking a task, the list could show wrong data under a filter, so I update the state only after the server replies, and remove the task from the list if it no longer matches the filter.

## What I would add next

- Login so each person has their own tasks
- Priorities and categories
- Drag and drop ordering
