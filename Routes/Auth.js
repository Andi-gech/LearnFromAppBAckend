const express = require("express");
const router = express.Router();
const { User, ValidateAuth } = require("../Models/Users");
const bcrypt = require("bcrypt");
const authmiddleware = require("../Middlewares/authmiddleware");

router.post("", async (req, res) => {
  const { error } = ValidateAuth(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  const user = await User.findOne({ Email: req.body.Email });

  if (!user) {
    return res.status(400).send("Email or password is incorrect");
  }

  const isValidPassword = await bcrypt.compare(
    req.body.Password,
    user.Password
  );

  if (!isValidPassword) {
    return res.status(400).send("Email or password is incorrect");
  }

  const token = user.generateAuthtoken();

  res.header("x-auth-token", token).send(token);
});

router.get("/me", authmiddleware, async (req, res) => {
  const users = await User.findById(req.user._id).select("-Password");
  res.json(users);
});

module.exports = router;
