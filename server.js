const express = require("express");
const cors = require("cors");

const server = express();
server.use(cors());
server.use(express.json());

const authRoutes = require("./routes/auth");
const habitRoutes = require("./routes/habits");
const habitDataRoutes = require("./routes/habitsData");

server.use("/auth", authRoutes);
server.use("/habit", habitRoutes);
server.use("/habitdata", habitDataRoutes);

server.get("/", (req, res) => res.send("Welcome to Our Habit Tracking Site!"));

module.exports = server;
