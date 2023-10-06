const User = require("../models/User");
const Note = require("../models/Note");

//? ------------------------------------------------------------------ asyncHandler
//ñ ---------------- This will help us keep down the number of try catche blocks as we use async methouds with mongoose to: save/delete/find data from mongoDB, we just need to rap it around our functions
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//? ------------------------------------------------------------------ @desc Get all users
//ñ ---------------- @route Get /users
//ñ ---------------- @access Private

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});

//? ------------------------------------------------------------------ @desc Create new user
//ñ ---------------- @route Post /users
//ñ ---------------- @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  //ç --------- Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //ç --------- Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  //ç --------- Hash the password
  const hashedPwd = await bcrypt.hash(password, 10);

  const userObject = { username, password: hashedPwd, roles };

  //ç --------- Create a new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid userdata recived" });
  }
});

//? ------------------------------------------------------------------ @desc Update a user
//ñ ---------------- @route Patch /users
//ñ ---------------- @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  console.log("");
  console.log("");
  console.log("");
  console.log("");
  console.log("");

  //ç --------- Confirm received data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({
      message: `All fields except password are required to update a user. \n Reading: id: ${id}, username: ${username}, Array.isArray(roles): ${Array.isArray(
        roles
      )}, roles.length: ${roles.length}, typeof active: ${typeof active}`,
    });
  }

  //ç --------- Confirm the user is already in the DB
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  //ç --------- Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  //ç --------- Allow updates to original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  //ç --------- Update user

  user.username = username;
  user.roles = roles;
  user.active = active;

  //ç --------- If the user has provided a password
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updateUser = await user.save();

  res.json({ message: `${updateUser.username} updated!` });
});

//? ------------------------------------------------------------------ @desc Delete a user
//ñ ---------------- @route Delete /users
//ñ ---------------- @access Private
const deleteAUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ message: `User ID required, Id provided: ${id}` });
  }

  //ç --------- A check to make sure the user has no tasks asigned
  const note = await Note.findOne({ user: id }).lean().exec();

  if (note) {
    return res
      .status(400)
      .json({
        message:
          "User has assigned notes, please remove their notes befour deleting.",
      });
  }

  //ç --------- A check to make sure the user has no tasks asigned

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  //ç --------- Delete user
  const result = await user.deleteOne();

  const reply = `Username: ${result.username} with id: ${result._id}, has been deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteAUser,
};
