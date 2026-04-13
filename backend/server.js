const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOrigins = process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/uploads", express.static("uploads"))

app.get("/", (req, res) => {
  res.send("API Running...");
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log("Server running on port " + port));