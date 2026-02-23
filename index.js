const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const formRoutes = require("./routes/formRoutes");
const SelfHeal = require("./selfheal");

dotenv.config();

const selfheal = new SelfHeal(
    process.env.server_url,
    process.env.API_KEY
);
selfheal.init(
    "https://github.com/ashwakshaik14/pepper_cloud-back",
    "index.js"
);

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://pepper-cloud-front.onrender.com",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 };
mongoose.connect(process.env.MONGO_URI, mongoOptions)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    if (err.message.includes('ENOTFOUND')) {
      console.error("MongoDB URI could not be resolved. Please check your MONGO_URI environment variable.");
    }
    // Try to recover from the error by retrying after a delay
    setTimeout(() => mongoose.connect(process.env.MONGO_URI, mongoOptions), 5000);
  });

app.use("/api/forms", formRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connection.on('error', (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on('open', () => {
  console.log("Mongoose connection is open");
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled promise rejection:', err);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected due to application termination');
    process.exit(0);
  });
});