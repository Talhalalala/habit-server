const express = require("express");
const router = express.Router();

const {
	create,
	displayAll,
	displayAHabit,
	destroy,
	displayEverything
} = require("../controllers/habit");
const { verifyToken } = require("../middleware/auth");

// create habits
router.post("/create", verifyToken, create);
// displays all users habits
router.post("/", verifyToken, displayAll);
// display singluar habit
router.get("/:id", verifyToken, displayAHabit);
// delete singular habit
router.delete("/:id", verifyToken, destroy);
// display all habits in habits table
router.get("/", verifyToken, displayEverything); // dev end-point used to show everything in habits

module.exports = router;
