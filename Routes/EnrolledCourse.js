const express = require("express");
const Router = express.Router();
const { Chapa } = require("chapa-nodejs");
const { Course } = require("../Models/Course");
const { User } = require("../Models/Users");
const { EnrolledCourse } = require("../Models/EnrolledCourse");
const Authmiddleware = require("../Middlewares/authmiddleware");

const chapa = new Chapa({
  secretKey: "CHASECK_TEST-s62PyadZVwA8RPNhxyyhRtWq5prWAfJ0",
});

Router.get("", Authmiddleware, async (req, res) => {
  const enrolledCourses = await EnrolledCourse.find({
    UserId: req.user._id,
  }).populate({
    path: "CourseId",
    select: "name coursepic Author",
    populate: {
      path: "Author",
      model: "Users",
      select: "Firstname",
    },
  });
  res.send(enrolledCourses);
});

Router.post("/:id", Authmiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).send("Course not found");
    }

    const enrollment = await EnrolledCourse.findOne({
      CourseId: course._id,
      UserId: req.user._id,
    });

    if (enrollment) {
      console.log("already enrolled");

      return res.status(400).send("You are already enrolled in this course");
    }

    const tx_ref = await chapa.generateTransactionReference();

    const response = await chapa.mobileInitialize({
      first_name: req.user.Firstname,
      last_name: req.user.Lastname,
      email: req.user.Email,
      currency: "ETB",
      amount: course.Price ? course.Price : 2,
      tx_ref: tx_ref,
      callback_url: `https://2dee-196-189-191-65.ngrok.io/api/enroll/verify/${course._id}`,
      return_url: "https://example.com/",
      customization: {
        title: "Test Title",
        description: "Test Description",
      },
    });

    res.send(response);
  } catch (error) {
    res.status(500).send("some Thing goes wrong");
  }
});

Router.get("/verify/:id", async (req, res) => {
  try {
    const response = await chapa.verify({
      tx_ref: req.body.trx_ref,
    });

    const course = await Course.findById(req.params.id);
    const user = await User.find({ Email: response.data.email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const enrollment = await EnrolledCourse.findOne({
      CourseId: course._id,
      UserId: user[0]._id,
    });

    if (!course) {
      return res.status(404).send("Course not found");
    }

    if (!enrollment) {
      const data = new EnrolledCourse({
        CourseId: course._id,
        UserId: user[0]._id,
        completedlessons: [],
      });

      const result = await data.save();
      console.log(result);
    }

    res.send(response.data.status);
  } catch (error) {
    res.send(error);
  }
});

module.exports = Router;
