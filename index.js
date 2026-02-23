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
  "https://pepper-cloud-front.onrender.com", // <-- Replace with your frontend URL
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
  allowedHeaders: ["Content-Type", "Authorization"], // Added Authorization for API authentication
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allows sending cookies with requests
}));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/forms", formRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
