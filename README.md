# To-Do App

A simple full-stack to-do application built with Node.js and vanilla JavaScript.

## What it does

- Add tasks to your list
- View all your tasks
- Delete tasks when you're done

## How to run it

1. Make sure you have Node.js installed
2. Create a `.env` file in the root folder with your database connection:
   ```
   DATABASE_URL="your_postgresql_connection_string"
   ```
3. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
4. Start the server:
   ```bash
   node index.js
   ```
5. Open your browser to `http://localhost:5000`

That's it! Your to-do app should be running.

## Tech stack

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: HTML, CSS, JavaScript
- **Database**: PostgreSQL (cloud hosted)

## File structure

```
├── backend/           # Server code
│   ├── index.js      # Main server file
│   └── package.json  # Dependencies
├── frontend/          # Client code
│   ├── index.html    # Main page
│   ├── script.js     # App logic
│   └── style.css     # Styling
└── .env              # Database connection (don't commit this!)
```