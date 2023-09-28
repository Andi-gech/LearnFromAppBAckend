const express = require("express");
const router = express.Router();
const { User, Validateuser } = require("../Models/Users");
const bcrypt = require("bcrypt");

router.post("", async (req, res) => {
  try {
    const { error } = Validateuser(req.body);
    if (error) {
      return res.status(400).send(error.message);
    }

    const hashedPassword = await bcrypt.hash(req.body.Password, 10);

    const newUser = new User({
      Firstname: req.body.Firstname,
      Lastname: req.body.Lastname,
      Email: req.body.Email,
      Password: hashedPassword,
      PhoneNo: req.body.PhoneNo,
      Role: req.body.Role,
    });

    const savedUser = await newUser.save();

    res.send(savedUser);
  } catch (error) {
    res.status(400).send("User with this email already exists");
  }
});

module.exports = router;
