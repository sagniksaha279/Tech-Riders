require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234", 
    database: "SmartVote",
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed:", err);
    } else {
        console.log("✅ Connected to SmartVote Database!");
    }
});

// Login API
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM evalDetails WHERE username = ? AND password = ?";
    
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error("Error in query:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        
        if (results.length > 0) {
            res.json({ success: true, message: "✅ Login successful!" });
        } else {
            res.json({ success: false, message: "❌ Username or Password does not match!" });
        }
    });
});

// Check EPIC API
app.post("/check-epic", (req, res) => {
    const { EPIC_no } = req.body;
    
    db.query("SELECT name, FatherName, voted, city FROM details WHERE EPIC_no = ?", [EPIC_no], (err, results) => {
        if (err) {
            console.error("❌ Error executing query:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        
        if (results.length > 0) {
            const user = results[0];
            
            if (user.voted) {
                res.json({
                    success: false,
                    alreadyVoted: true, 
                    message: "⚠️ This person has already voted! Voting again is not allowed."
                });
            } else {
                db.query("UPDATE details SET voted = TRUE WHERE EPIC_no = ?", [EPIC_no], (updateErr) => {
                    if (updateErr) {
                        console.error("❌ Error updating voted status:", updateErr);
                        return res.status(500).json({ success: false, message: "Error updating vote status" });
                    }
                    
                    res.json({
                        success: true,
                        name: user.name,   
                        father_name: user.FatherName,  
                        city: user.city,
                        message: "🗳️ Vote Registered Successfully!"
                    });
                });
            }
        } else {
            res.json({ success: false, message: "❌ EPIC number not found" });
        }
    });
});


// Route to store feedback
app.post("/submit-feedback", (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Feedback cannot be empty" });
    }

    const sql = "INSERT INTO feedback (message) VALUES (?)";
    db.query(sql, [message], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.status(201).json({ message: "Thank you for sending us feedback!" });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

