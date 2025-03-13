const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Change if needed
    password: "1234", // Change if you have a MySQL password
    database: "evaluator"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL Database!");
});

// Login API
app.post("/login", (req, res) => {
    const { username, password, city } = req.body;

    const query = "SELECT * FROM evalDetails WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Error in query:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (results.length > 0) {
            res.json({ 
                success: true, 
                message: "✅ Login successful!" });
        } else {
            res.json({ 
                success: false, 
                message: "❌ Username or Password does not match!" });
        }
    });
});


// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
