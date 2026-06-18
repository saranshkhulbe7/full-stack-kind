import Redis from "ioredis";

const PORT = Number(process.env.PORT || 4001);
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(REDIS_URL);

const server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",

  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return Response.json({
        service: "ws-server",
        status: "ok",
        wsPath: "/ws",
      });
    }

    if (url.pathname === "/health") {
      return Response.json({
        service: "ws-server",
        status: "healthy",
      });
    }

    if (url.pathname === "/ws") {
      const upgraded = server.upgrade(req);

      if (!upgraded) {
        return new Response("WebSocket upgrade failed", { status: 400 });
      }

      return undefined;
    }

    return new Response("Not found", { status: 404 });
  },

  websocket: {
    open(ws) {
      ws.send(
        JSON.stringify({
          type: "connected",
          message: "Connected to ws-server",
        }),
      );
    },

    async message(ws, message) {
      const payload = {
        message: String(message),
        createdAt: new Date().toISOString(),
      };

      await redis.lpush("ws-messages", JSON.stringify(payload));

      ws.send(
        JSON.stringify({
          type: "echo",
          data: payload,
        }),
      );
    },

    close() {
      console.log("WebSocket connection closed");
    },
  },
});

console.log(`ws-server running on port ${server.port}`);
