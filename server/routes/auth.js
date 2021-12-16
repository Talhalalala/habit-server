const express = require("express");
const router = express.Router();

const { register, login, showUsers, destroy } = require("../controllers/user");
const { verifyToken } = require("../middleware/auth");

// create new user
router.post("/register", register);
// send token and user details back on successful login
router.post("/login", login);
// delete specified user
router.delete("/:id", verifyToken, destroy);
// show all users
router.get("/", verifyToken, showUsers); //dev endpoint, used for testing purposes

module.exports = router;
