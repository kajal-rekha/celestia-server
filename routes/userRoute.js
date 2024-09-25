const express = require("express");

const { isAuthenticated } = require("../middlewares/auth");
const { isAdmin } = require("../middlewares/isAdmin");
const { loginUser, createUser, getAllUsers, updateUser, deleteUser, getAnUser } = require("../controllers/userController");

// router
const router = express.Router();

// signup
router.post("/auth/register", createUser);

// login
router.post("/auth/login", loginUser);

// get all users
router.get("/", isAuthenticated, isAdmin, getAllUsers);

// Get an user 
router.get("/:userId", isAuthenticated, isAdmin, getAnUser);


// Update an user 
router.put("/:userId", isAuthenticated, isAdmin, updateUser);

// Delete an user 
router.delete("/:userId", isAuthenticated, isAdmin, deleteUser);

module.exports = router;