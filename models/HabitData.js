const db = require("../db_config/config");

class Habit_Data {
	constructor(data) {
		this.data_id = data.habit_data_id;
		this.habit_id = data.habit_id;
		this.date = data.habit_date;
		this.amount = data.habit_amount;
		this.achieved = data.habit_achieved;
	}

	static create(habit_id, habit_amount) {
		return new Promise(async (res, rej) => {
			try {
				let newHabitData = await db.query(
					"INSERT INTO habit_data (habit_id, habit_date, habit_amount) VALUES ($1, CURRENT_DATE, $2) RETURNING *;",
					[habit_id, habit_amount]
				);
				let r = new Habit_Data(newHabitData.rows[0]);
				res(r);
			} catch (err) {
				rej("Error, failed to create new habit data");
			}
		});
	}

	static increaseStreak(habit_id) {
		return new Promise(async (res, rej) => {
			try {
				let results = await db.query("UPDATE habits SET streak = streak + 1 WHERE habit_id = $1", [
					habit_id
				]);
			} catch (err) {
				rej(`Error increasing streak: ${err}`);
			}
		});
	}

	static checkGoalAchieved(habit_id) {
		return new Promise(async (res, rej) => {
			try {
				let results = await db.query(
					`
                    SELECT habits.goal, habit_data.habit_amount, habit_data.habit_data_id
                    FROM habits
                    LEFT JOIN
                    (
                        SELECT habit_data.*
                        FROM habit_data
                        WHERE habit_data.habit_date = CURRENT_DATE
                    )
                    AS habit_data
                    ON habits.habit_id = habit_data.habit_id
                    WHERE habits.habit_id = $1
                    ORDER BY habit_data.habit_date DESC;`,
					[habit_id]
				);
				if (results.rows[0].habit_amount >= results.rows[0].goal) {
					let update = await db.query(
						"UPDATE habit_data SET habit_achieved = true WHERE habit_data_id = $1 RETURNING *;",
						[results.rows[0].habit_data_id]
					);
					Habit_Data.increaseStreak(habit_id);
				}
				res(results.rows);
			} catch (err) {
				rej(`Error checking goal achieved: ${err}`);
			}
		});
	}

	static checkStreak(habit_id) {
		return new Promise(async (res, rej) => {
			try {
				let yesterday = await db.query(
					`SELECT habit_achieved FROM habit_data WHERE habit_id = $1 AND habit_date = (current_date - INTERVAL '1 day')::date;`,
					[habit_id]
				);
				let today = await db.query(
					"SELECT habit_achieved FROM habit_data WHERE habit_id = $1 AND habit_date = CURRENT_DATE;",
					[habit_id]
				);
				if (
					(!yesterday.rows.length || yesterday.rows[0].habit_achieved === false) &&
					!today.rows.length
				) {
					let results = await db.query("UPDATE habits SET streak = 0 WHERE habit_id = $1", [
						habit_id
					]);
				}
			} catch (err) {
				rej(`Error increasing streak: ${err}`);
			}
		});
	}

	static homepage(user_id) {
		return new Promise(async (res, rej) => {
			try {
				let results = await db.query(
					`SELECT habits.*, habit_data.habit_data_id, habit_data.habit_date, habit_data.habit_amount, habit_data.habit_achieved 
                    FROM habits
                    LEFT JOIN
                    (
                        SELECT habit_data.*
                        FROM habit_data
                        WHERE habit_data.habit_date = CURRENT_DATE
                    )
                    AS habit_data
                    ON habits.habit_id = habit_data.habit_id
                    WHERE habits.user_id = $1
                    ORDER BY habits.habit;`,
					[user_id]
				);
				res(results.rows);
			} catch (err) {
				rej(`Error retrieving homepage habit data: ${err}`);
			}
		});
	}

	// Read all data for one habit (history)
	static readHistoricalHabitData(habit_id) {
		return new Promise(async (res, rej) => {
			try {
				let results = await db.query(
					"SELECT * FROM habit_data where habit_id = $1 ORDER BY habit_date DESC;",
					[habit_id]
				);
				if (results.rows.length) {
					let habitEvents = results.rows.map(r => new Habit_Data(r));
					res(habitEvents);
				} else {
					throw "No historical data found for given habit";
				}
			} catch (err) {
				rej(`Error retrieving historical habit data: ${err}`);
			}
		});
	}

	// Read one habit data
	static readOneHabitData(habit_id) {
		return new Promise(async (res, rej) => {
			try {
				let results = await db.query(
					"SELECT * from habit_data where habit_id = $1 AND habit_date = CURRENT_DATE;",
					[habit_id]
				);
				if (results.rows.length !== 0) {
					let event = new Habit_Data(results.rows[0]);
					res(event);
				} else {
					res([]);
				}
			} catch (err) {
				rej(`Error retrieving one event data: ${err}`);
			}
		});
	}

	// Update habitData
	static update(habit_amount, habit_data_id) {
		return new Promise(async (res, rej) => {
			try {
				let result = await db.query(
					`UPDATE habit_data SET habit_amount = (habit_amount + $1) WHERE habit_data_id = $2 RETURNING *;`,
					[habit_amount, habit_data_id]
				);
				let habit = new Habit_Data(result.rows[0]);
				res(habit);
			} catch (err) {
				rej(`Error updating one event data: ${err}`);
			}
		});
	}

	static get everything() {
		return new Promise(async (res, rej) => {
			try {
				let result = await db.query(`SELECT * from habit_data;`);
				let habits_data = result.rows.map(r => new Habit_Data(r));
				res(habits_data);
			} catch (err) {
				rej(`Error retrieving habits data: ${err}`);
			}
		});
	}
}

module.exports = Habit_Data;
