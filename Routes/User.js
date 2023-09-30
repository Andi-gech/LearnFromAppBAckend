const express = require("express");
const router = express.Router();
const { User, Validateuser } = require("../Models/Users");
const bcrypt = require("bcrypt");
const upload = require("./multer");
const cloudinary = require("./cloudinary");
router.post("", upload.single("profilepic"), async (req, res) => {
  try {
    const { error } = Validateuser(req.body);
    if (error) {
      return res.status(400).send(error.message);
    }

    const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    const upload = req.file
      ? await cloudinary.uploader.upload(req.file.path)
      : null;

    const newUser = new User({
      Firstname: req.body.Firstname,
      Lastname: req.body.Lastname,
      Email: req.body.Email,
      Password: hashedPassword,
      PhoneNo: req.body.PhoneNo,
      Role: req.body.Role,
      ProfilePic: upload?.secure_url,
    });

    const savedUser = await newUser.save();

    res.send(savedUser);
  } catch (error) {
    res.status(400).send("User with this email already exists");
  }
});

module.exports = router;
