# Brew Umber

A full-stack web application featuring a Node.js backend (with email utilities and data models) and a frontend client interface.

## Project Structure

```text
├── backend/
│   ├── models/        # Database models (e.g., order.js)
│   ├── utils/         # Helper functions & services (e.g., sendemail.js)
│   ├── .env           # Environment configuration (Ignored in Git)
│   ├── package.json   # Backend dependencies and scripts
│   └── server.js      # Main server entry point
├── frontend/          # Client-side interface
└── README.md
```

## Features

- **Backend API & Server:** Built with Node.js to handle requests, business logic, and database schemas.
- **Email Notifications:** Integrated utility (`sendemail.js`) for automated communication.
- **Data Modeling:** Structured models (such as `order.js`) for handling application data.
- **Secure Configuration:** Environment variables managed securely via `.env`.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- npm or yarn

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <https://github.com/anshukamboj/Brew-Umber>
   cd <Brew Umber>
   ```

2. **Setup the Backend:**
   Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file inside the `backend` folder and add your configuration details (e.g., database URIs, email credentials, port numbers):
   ```env
   PORT=5000
   MONGO_URI=your_database_connection_string
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

4. **Setup the Frontend:**
   Navigate to the frontend directory and install dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

---

## Running the Application

- **Start the Backend Server:**
  ```bash
  cd backend
  npm start
  # or for development with nodemon:
  npm run dev
  ```

- **Start the Frontend Client:**
  ```bash
  cd frontend
  npm start
  ```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.