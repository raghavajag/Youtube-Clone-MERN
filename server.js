const express = require("express");
const app = express();
const methodOverRide = require("method-override");
const connectDB = require("./config/db");
const cors = require("cors");

app.use(cors());
// Connect Database
connectDB();
// Init Middleware
app.use(express.json({ extended: false }));
app.use(methodOverRide("_method"));
app.use("/uploads", express.static("uploads"));

// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/video", require("./routes/video"));
app.use("/api/subscriber", require("./routes/subscriber"));
app.use("/api/comment", require("./routes/comment"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
