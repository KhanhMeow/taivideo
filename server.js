const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Phục vụ file HTML
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Hàm lấy ID từ link Xiaohongshu
function extractId(url) {
    const match = url.match(/explore\/([\w\d]+)/);
    return match ? match[1] : null;
}

app.post("/api/download", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) return res.status(400).json({ error: "Thiếu URL!" });

        const id = extractId(url);
        if (!id) return res.status(400).json({ error: "Không lấy được ID từ link!" });

        const apiUrl = `https://xhsapi.sxsapi.workers.dev/video?id=${id}`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.data) {
            return res.status(500).json({ error: "Không lấy được dữ liệu video!" });
        }

        res.json({
            video_url: response.data.data.video_url,
            cover: response.data.data.cover,
            desc: response.data.data.desc
        });

    } catch (err) {
        console.log("ERROR:", err?.response?.data || err);
        res.status(500).json({ error: "Lỗi server!" });
    }
});

app.listen(3000, () => {
    console.log("🚀 Server chạy tại: http://localhost:3000");
});
