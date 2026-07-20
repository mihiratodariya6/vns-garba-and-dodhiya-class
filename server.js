require("dotenv").config();
const axios = require("axios");
const FormData = require("form-data");

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});

// Home Route
app.get("/", (req, res) => {
    res.send("✅ VNS Garba Backend Running Successfully");
});

// Registration Route
app.post(
    "/register",
    upload.fields([
        { name: "aadhaar", maxCount: 1 },
        { name: "studentPhoto", maxCount: 1 },
        { name: "paymentScreenshot", maxCount: 1 }
    ]),
    async (req, res) => {

        try {

            console.log("========== NEW REGISTRATION ==========");

            const message = `🎉 NEW REGISTRATION

👤 Name: ${req.body.name}

📱 Mobile: ${req.body.phone}

🎂 Age: ${req.body.age}

📅 DOB: ${req.body.dob}

🚻 Gender: ${req.body.gender}

📧 Email: ${req.body.email}

🕒 Batch: ${req.body.batch}

💳 Payment: ${req.body.payment}

🆔 Transaction ID: ${req.body.transactionId}
`;

await sendTelegramMessage(message);

res.json({
    success: true,
    message: "Telegram Message Sent Successfully"
});

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: "Server Error"
            });

        }

    }
);

const PORT = process.env.PORT || 3000;

async function sendTelegramMessage(message) {

    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
        chat_id: process.env.CHAT_ID,
        text: message
    });

}

app.listen(PORT, () => {

    console.log(`✅ Server Running On Port ${PORT}`);

});