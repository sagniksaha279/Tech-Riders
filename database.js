// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Database connection
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "1234", 
//     database: "SmartVote",
//     port: 3306
// });

// db.connect(err => {
//     if (err) {
//         console.error("❌ Database connection failed:", err);
//     } else {
//         console.log("✅ Connected to SmartVote database");
//     }
// });


// // API Route to check EPIC number and mark as voted
// app.post("/check-epic", (req, res) => {
//     const { EPIC_no } = req.body;

//     // First, check if the EPIC number exists
//     db.query("SELECT name, FatherName, voted, city FROM details WHERE EPIC_no = ?", [EPIC_no], (err, results) => {
//         if (err) {
//             console.error("❌ Error executing query:", err);
//             res.status(500).json({ success: false, message: "Database error" });
//         } else if (results.length > 0) {
//             const user = results[0];

//             // Check if the person has already voted
//             if (user.voted) {
//                 res.json({
//                     success: false,
//                     alreadyVoted: true, 
//                     message: "⚠️ This person has already voted! Voting again is not allowed."
//                 });
//             } else {
//                 // Mark as voted
//                 db.query("UPDATE details SET voted = TRUE WHERE EPIC_no = ?", [EPIC_no], (updateErr) => {
//                     if (updateErr) {
//                         console.error("❌ Error updating voted status:", updateErr);
//                         res.status(500).json({ success: false, message: "Error updating vote status" });
//                     } else {
//                         res.json({
//                             success: true,
//                             name: user.name,   
//                             father_name: user.FatherName,  
//                             address: user.address,
//                             city: user.city,
//                             message: "🗳️ Vote Registered Successfully!"
//                         });
//                     }
//                 });
//             }
//         } else {
//             res.json({ success: false, message: "❌ EPIC number not found" });
//         }
//     });
// });


// app.listen(3000, () => {
//     console.log("🚀 Server running on http://localhost:3000");
// });
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

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

// Function to send SMS using Fast2SMS
const sendSMS = (phoneNumber, voterName) => {
    const apiKey = process.env.uxE2W9RVwd68G7E7sgtRg9BO3FdOwSAAIV0MiS0cpgk1MIgMUYXznxYOejDD; // Store API key in .env file
    const message = `Hello ${voterName}, your vote has been successfully registered. Thank you for voting! 🗳️`;
    
    axios.post("https://www.fast2sms.com/dev/bulkV2", {
        route: "q",  
        message: message,
        language: "english",
        flash: 0,
        numbers: phoneNumber
    }, {
        headers: {
            "authorization": apiKey,
            "Content-Type": "application/json"
        }
    })
    .then(response => console.log("📩 SMS sent successfully:", response.data))
    .catch(error => console.error("❌ Error sending SMS:", error.response.data));
};

// API Route to check EPIC number and mark as voted
app.post("/check-epic", (req, res) => {
    const { EPIC_no } = req.body;

    // First, check if the EPIC number exists
    db.query("SELECT name, FatherName, voted, city, phoneNumber FROM details WHERE EPIC_no = ?", [EPIC_no], (err, results) => {
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
                        // Send SMS confirmation
                        sendSMS(user.phoneNumber, user.name);

                        res.json({
                            success: true,
                            name: user.name,   
                            father_name: user.FatherName,  
                            city: user.city,
                            message: "🗳️ Vote Registered Successfully! Confirmation SMS Sent."
                        });
                    }
                });
            }
        } else {
            res.json({ success: false, message: "❌ EPIC number not found" });
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
