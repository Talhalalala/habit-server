const express = require("express");
const router = express.Router();

const {
	createAndOrUpdate,
	displayEverything,
	TodayHabit,
	AllHabitHistory,
	Homepage
} = require("../controllers/habitData");
const { verifyToken } = require("../middleware/auth");

// display all habits data table entries
router.get("/", verifyToken, displayEverything); // dev end-point used to show everything in habits data table
// updates existing entry or creates new one
router.post("/", verifyToken, createAndOrUpdate);
// returns all the history on a given habit
router.get("/all/:id", verifyToken, AllHabitHistory);
// returns everything needed for homepage
router.get("/homepage/:id", verifyToken, Homepage); // Use this new Route for the homepage to load everything at once
// returns todays record of the habit if it exists
router.get("/:id", verifyToken, TodayHabit);

module.exports = router;
