const { createToken } = require("../helper/helper");
const User = require("../models/userModel");

// create user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.signup(
      name,
      email,
      password,
      
    );

    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a user
const getAnUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user 
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password } = req.body;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { name, email, password},
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updateUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete user 
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  createUser,
  getAllUsers,
  getAnUser,
  updateUser,
  deleteUser,
};