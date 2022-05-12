const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const auth = require("./middleware/auth.js");
const app = express();

const dataBase = require("./models");

const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");
const publicationRoutes = require("./routes/publication");

// Configuration cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(helmet());
app.use(cors());
app.use(express.json());

dataBase.sequelize.sync(); // Synchronisation de la base de données grâce à Sequelize

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", authRoutes);

app.use("/api/users", auth, userRoutes);
app.use("/api/comments", auth, commentRoutes);
app.use("/api/publications", auth, publicationRoutes);

module.exports = app;
