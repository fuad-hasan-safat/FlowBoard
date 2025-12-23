import http from "http";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { initSocket } from "./socket";

const start = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    // 🔴 Initialize socket ONCE
    initSocket(server);

    server.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
};

start();
