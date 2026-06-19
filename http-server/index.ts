import express from "express";
import cors from "cors";
import Redis from "ioredis";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT || 4000);
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(REDIS_URL);

app.get("/", (_req, res) => {
  res.json({
    service: "http-server",
    status: "ok",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    service: "http-server",
    status: "healthy",
  });
});

app.post("/api/messages", async (req, res) => {
  const message = req.body?.message || "hello from http-server";

  const payload = {
    message,
    createdAt: new Date().toISOString(),
  };

  await redis.lpush("messages", JSON.stringify(payload));

  res.json({
    ok: true,
    saved: payload,
  });
});

app.get("/api/messages", async (_req, res) => {
  const rawMessages = await redis.lrange("messages", 0, 9);

  res.json({
    messages: rawMessages.map((item) => JSON.parse(item)),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`http-server running on port ${PORT}`);
});
