import { connectDB } from "./config/db";
import app from "./app";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

async function startServer() {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
}

startServer();
