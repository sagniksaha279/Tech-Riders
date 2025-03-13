const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");


const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

// Database connection
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
        console.log("✅ Connected to SmartVote database");
    }
});


// API Route to check EPIC number and mark as voted
app.post("/check-epic", (req, res) => {
    const { EPIC_no } = req.body;

    // First, check if the EPIC number exists
    db.query("SELECT name, FatherName, voted, city FROM details WHERE EPIC_no = ?", [EPIC_no], (err, results) => {
        if (err) {
            console.error("❌ Error executing query:", err);
            res.status(500).json({ success: false, message: "Database error" });
        } else if (results.length > 0) {
            const user = results[0];

            // Check if the person has already voted
            if (user.voted) {
                res.json({
                    success: false,
                    alreadyVoted: true, 
                    message: "⚠️ This person has already voted! Voting again is not allowed."
                });
            } else {
                // Mark as voted
                db.query("UPDATE details SET voted = TRUE WHERE EPIC_no = ?", [EPIC_no], (updateErr) => {
                    if (updateErr) {
                        console.error("❌ Error updating voted status:", updateErr);
                        res.status(500).json({ success: false, message: "Error updating vote status" });
                    } else {
                        res.json({
                            success: true,
                            name: user.name,   
                            father_name: user.FatherName,  
                            address: user.address,
                            city: user.city,
                            message: "🗳️ Vote Registered Successfully!"
                        });
                    }
                });
            }
        } else {
            res.json({ success: false, message: "❌ EPIC number not found" });
        }
    });
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
