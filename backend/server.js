const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "yash2002",
    database: process.env.DB_NAME || "taskdb"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }

    console.log("Connected to MySQL database");
});

// Test API
app.get("/", (req, res) => {
    res.json({
        message: "Full Stack Task App Backend is running"
    });
});

// Get all tasks
app.get("/tasks", (req, res) => {
    const sql = "SELECT * FROM tasks";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

// Add a task
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const sql = "INSERT INTO tasks (title) VALUES (?)";

    db.query(sql, [title], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "Task added successfully",
            task: {
                id: result.insertId,
                title: title,
                completed: false
            }
        });
    });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM tasks WHERE id = ?";

    db.query(sql, [id], (err) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: "Task deleted successfully"
        });
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
