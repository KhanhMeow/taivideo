const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Hàm lấy ID từ mọi loại link Xiaohongshu
function extractId(url) {
    const match = url.match(/explore\/([\w\d]+)/);
    return match ? match[1] : null;
}

app.post("/api/download", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) return res.status(400).json({ error: "Thiếu URL!" });

        // Lấy ID
        const id = extractId(url);
        if (!id) return res.status(400).json({ error: "Không lấy được ID từ link!" });

        // API khác ổn định hơn
        const apiUrl = `https://xhsapi.sxsapi.workers.dev/video?id=${id}`;

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
        console.log("ERROR:", error?.response?.data || error);
        return res.status(500).json({ error: "Lỗi server!" });
    }
});

app.listen(3000, () => {
    console.log("🚀 Server chạy tại: http://localhost:3000");
});
