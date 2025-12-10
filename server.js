const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Giao diện chính (GET /)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// API tải video Xiaohongshu
app.post("/api/download", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "Thiếu URL!" });
        }

        const apiUrl = `https://api.igeek.workers.dev/xhs/video?url=${encodeURIComponent(url)}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.data) {
            return res.status(500).json({ error: "Không lấy được dữ liệu video!" });
        }

        return res.json({
            video_url: response.data.data.video_url,
            cover: response.data.data.cover,
            desc: response.data.data.desc
        });

    } catch (error) {
        console.error("ERROR:", error);
        return res.status(500).json({ error: "Lỗi server!" });
    }
});

app.listen(3000, () => {
    console.log("🚀 Server chạy tại: http://localhost:3000");
});
