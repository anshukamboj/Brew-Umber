# Brew Umber 

A full-stack web application featuring a Node.js/Express backend and a modern frontend built with Vite.

##  Project Structure

```text
├── backend/
│   ├── models/         # Database models (e.g., order.js)
│   ├── utils/          # Helper utilities (e.g., sendemail.js)
│   ├── .env            # Environment variables (Ignored by Git)
│   ├── package.json
│   └── server.js       # Entry point for the backend server
│
└── frontend/
    ├── public/         # Public static assets
    ├── src/            # Frontend source code
    ├── index.html
    ├── package.json
    └── vite.config.js  # Vite configuration
```

##  Tech Stack

- **Backend:** Node.js, Express, JavaScript
- **Frontend:** Vite, HTML/CSS/JS

---

##  Getting Started & Installation

To run this project locally, follow these steps:

### 1. Clone the Repository
```bash
git clone `https://github.com/anshukamboj/Brew-Umber`
cd <Brew-Umber>
```

### 2. Setup the Backend
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
*Create a `.env` file inside the `backend` folder and add your required environment variables (e.g., port, database URI, email service credentials).*

Start the backend server:
```bash
npm run start
# or for dev mode with nodemon:
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

---

##  Security Note
This repository includes a `.gitignore` file that automatically excludes sensitive configuration files like `.env` and large dependency folders like `node_modules` from being pushed to GitHub.