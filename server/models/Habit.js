const db = require("../db_config/config");
const Habit_Data = require("./HabitData");

class Habit {
	constructor(data) {
		this.habit_id = data.habit_id;
		this.id = data.user_id;
		this.habit = data.habit;
		this.goal = data.goal;
		this.units = data.units;
		this.streak = data.streak;
	}

	// function to display all users active habits
	static allUserHabits(user_id) {
		return new Promise(async (res, rej) => {
			try {
				let results = await db.query(`SELECT * from habits where user_id = $1;`, [user_id]);
				let habits = results.rows.map(r => new Habit(r));
				res(habits);
			} catch (err) {
				rej(`Error retrieving habits: ${err}`);
			}
		});
	}

	static OneUserHabit(habit_id) {
		return new Promise(async (resolve, reject) => {
			try {
				let results = await db.query("SELECT * from habits where habit_id = $1;", [habit_id]);
				if (results.rows.length) {
					let habit = new Habit(results.rows[0]);
					resolve(habit);
				} else {
					throw "This user has no habits with this habit_id";
				}
			} catch (err) {
				reject(`Error retrieving the habit: ${err}`);
			}
		});
	}

	static create(habitData) {
		return new Promise(async (resolve, reject) => {
			try {
				const { habit, goal, units, user_id } = habitData;
				let newHabit = await db.query(
					"INSERT INTO habits (habit, goal, units, user_id, streak) VALUES ($1, $2, $3, $4, 0) RETURNING *;",
					[habit, goal, units, user_id]
				);
				let r = new Habit(newHabit.rows[0]);
				resolve(r);
			} catch (err) {
				reject("Habit could not be created");
			}
		});
	}

	static destroy(habit_id) {
		return new Promise(async (res, rej) => {
			try {
				const del = await db.query("DELETE FROM habits WHERE habit_id = $1;", [habit_id]);
				res("Habit has been deleted");
			} catch (err) {
				rej("Habit could not be deleted");
			}
		});
	}

	static get everything() {
		return new Promise(async (res, rej) => {
			try {
				let result = await db.query(`SELECT * from habits;`);
				let habits = result.rows.map(r => new Habit(r));
				res(habits);
			} catch (err) {
				rej(`Error retrieving habits: ${err}`);
			}
		});
	}

	static readCurrentHabitStreak(user_id, habit_id) {
		return new Promise(async (res, rej) => {
			try {
				let results = await db.query(
					"SELECT streak FROM habits WHERE user_id = $1 AND habit_id = $2;",
					[user_id, habit_id]
				);
				if (results.rows.length) {
					let event = new Habit_Data(results.rows[0]);
					res(event);
				} else {
					throw "No given streak for this user_id and habit_id";
				}
			} catch (err) {
				rej(`Error retrieving streak data for this habit_id: ${err}`);
			}
		});
	}

	get destroy() {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await db.query("DELETE FROM habits WHERE habit_id = $1 RETURNING user_ID", [
					this.habit_id
				]);
				resolve(`Habit ${result.habit} was deleted`);
			} catch (err) {
				reject("Habit could not be deleted");
			}
		});
	}
}

module.exports = Habit;
