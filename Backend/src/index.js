import app from "./server.js";
import connectDB from "./database.js";

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/donaty";

const startServer = async () => {
  await connectDB(MONGODB_URI);
  app.listen(PORT, () => {
    console.log(`Donaty API corriendo en puerto ${PORT}`);
  });
};

startServer();
