const db = require("../db_config/config");

class User {
	constructor(data) {
		this.id = data.user_id;
		this.username = data.username;
		this.email = data.email;
		this.hpassword = data.hpassword;
	}

	static get all() {
		return new Promise(async (resolve, reject) => {
			try {
				let usersData = await db.query("SELECT * FROM users;");
				let users = usersData.rows.map(u => new User(u));
				resolve(users);
			} catch (err) {
				reject("Users not found");
			}
		});
	}

	static create({ username, email, hpassword }) {
		return new Promise(async (res, rej) => {
			try {
				let result = await db.query(
					`INSERT INTO users (username, email, hpassword)
                                            VALUES ($1, $2, $3) RETURNING *;`,
					[username, email, hpassword]
				);
				let user = new User(result.rows[0]);
				res(user);
			} catch (err) {
				rej(`Error creating user: ${err}`);
			}
		});
	}

	static findByEmail(email) {
		return new Promise(async (res, rej) => {
			try {
				let result = await db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
				let user = new User(result.rows[0]);
				res(user);
			} catch (err) {
				rej(`Error retrieving user: ${err}`);
			}
		});
	}

	static findById(id) {
		return new Promise(async (res, rej) => {
			try {
				let result = await db.query(`SELECT * FROM users WHERE user_id = $1;`, [id]);
				let user = new User(result.rows[0]);
				res(user);
			} catch (err) {
				rej(`Error retrieving user: ${err}`);
			}
		});
	}

	get destroy() {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await db.query("DELETE FROM users WHERE user_id = $1 RETURNING user_id;", [this.id]);
				console.log(result)
				resolve(`User ${result.rows[0].id} was deleted`);
			} catch (err) {
				reject("User could not be deleted");
			}
		});
	}
}

module.exports = User;
