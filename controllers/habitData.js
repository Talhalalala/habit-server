const Habit = require("../models/Habit");
const User = require("../models/User");
const Habit_Data = require("../models/HabitData");

async function createAndOrUpdate(req, res) {
	try {
		let requestAmount = req.body.habit_amount;
		let requestHabitId = req.body.habit_id;
		let exists = await Habit_Data.readOneHabitData(requestHabitId);
		if (exists.length !== 0) {
			let update = await Habit_Data.update(requestAmount, exists.data_id);
		} else {
			let create = await Habit_Data.create(requestHabitId, requestAmount);
		}
		Habit_Data.checkGoalAchieved(requestHabitId);
		res.status(201).json(create);
	} catch (err) {
		res.status(501);
	}
}

async function displayEverything(req, res) {
	try {
		const habits = await Habit_Data.everything;
		res.status(200).json(habits);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function TodayHabit(req, res) {
	try {
		const habit_data = await Habit_Data.readOneHabitData(req.params.id);
		res.status(200).json(habit_data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

async function AllHabitHistory(req, res) {
	try {
		const habit_data = await Habit_Data.readHistoricalHabitData(req.params.id);
		res.status(200).json(habit_data);
	} catch (err) {
		res.status(404).json({ err });
	}
}

function getCurrentDate() {
	let today = new Date().toISOString().slice(0, 10);
	return today;
}

async function Homepage(req, res) {
	try {
		let results = await Habit_Data.homepage(req.params.id);
		const streakSet = results.forEach(async habit => await Habit_Data.checkStreak(habit.habit_id));
		results = await Habit_Data.homepage(req.params.id);
		res.status(200).json(results);
	} catch (err) {
		res.status(404).json({ err });
	}
}

module.exports = {
	createAndOrUpdate,
	displayEverything,
	TodayHabit,
	AllHabitHistory,
	Homepage
};
