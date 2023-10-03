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
   const users =  await User.find().select("-password").lean()

   if(!users){
    return res.status(400).json({message: "No users found"})
   }

   res.json(users)
})

//? ------------------------------------------------------------------ @desc Create new user
//ñ ---------------- @route Post /users
//ñ ---------------- @access Private
const createNewUser = asyncHandler(async (req, res) = {
     
})

//? ------------------------------------------------------------------ @desc Update a user
//ñ ---------------- @route Patch /users
//ñ ---------------- @access Private
const updateAUser = asyncHandler(async (req, res) = {

})
//? ------------------------------------------------------------------ @desc Delete a user
//ñ ---------------- @route Delete /users
//ñ ---------------- @access Private
const deleteAUser = asyncHandler(async (req, res) = {

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateAUser,
    deleteAUser
}
