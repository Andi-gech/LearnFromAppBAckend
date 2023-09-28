const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const authmiddleware = require("../Middlewares/authmiddleware");
const enrollmiddleware = require("../Middlewares/checkenrollmiddleware");
const { Course, ValidateCourse } = require("../Models/Course");
const checkCompletionMiddleware = require("../Middlewares/CheckCompletedlesson");
const {
  EnrolledCourse,
  checkEnrolledvalidation,
} = require("../Models/EnrolledCourse");
const { Lessons, checklessonvalidation } = require("../Models/Lessons");

const upload = require("./multer");
const cloudinary = require("./cloudinary");

// Get all courses with author's first name
router.get("", authmiddleware, async (req, res) => {
  try {
    const courses = await Course.find().populate("Author", "Firstname");
    res.send(courses);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a specific course by ID
router.get("/:id", [authmiddleware], async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.send(course);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get lessons for a specific course
router.get("/:id/lessons", [authmiddleware], async (req, res) => {
  try {
    const lessonNames = await Lessons.find({ CourseId: req.params.id })
      .select("title order")
      .sort("order");

    // const enrollment = await EnrolledCourse.findOne({
    //   CourseId: req.params.id,
    //   UserId: req.user._id,
    // });

    // if (!enrollment) {
    //   return res.status(404).json({ message: "Enrollment not found" });
    // }

    // // Get the lesson IDs that the user has completed
    // const completedLessonIds = enrollment.completedlessons.map(
    //   (completedLesson) => completedLesson._id.toString()
    // );

    // // Add a completionStatus property to each lesson
    // const lessonsWithCompletionStatus = lessons.map((lesson) => ({
    //   ...lesson.toObject(),
    //   completionStatus: completedLessonIds.includes(lesson._id.toString()),
    // }));
    // lessons.sort((a, b) => a.order - b.order);

    res.json(lessonNames);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Get a specific lesson by ID for a specific course
router.get(
  "/:id/lessons/:lessonid",
  [authmiddleware, enrollmiddleware, checkCompletionMiddleware],
  async (req, res) => {
    try {
      const lesson = await Lessons.findById(req.params.lessonid);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Check if the lesson belongs to the specified course
      if (lesson.CourseId.toString() !== req.params.id) {
        return res
          .status(404)
          .json({ message: "Lesson not found for the specified course" });
      }

      res.json(lesson);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Mark a lesson as completed for a specific course
router.put(
  "/:id/lessons/:lessonid/complete",
  [authmiddleware, enrollmiddleware],
  async (req, res) => {
    try {
      const enrollment = await EnrolledCourse.findOne({
        CourseId: req.params.id,
        UserId: req.user._id,
      });

      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }

      const lesson = await Lessons.findById(req.params.lessonid);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      console.log("enterd");
      const isLessonCompleted = enrollment.completedlessons.some(
        (completedLesson) => {
          return completedLesson._id.toString() === req.params.lessonid;
        }
      );

      if (isLessonCompleted) {
        return res.status(400).json({ message: "Lesson already completed" });
      }

      enrollment.completedlessons.push(lesson._id);
      await enrollment.save();

      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Create a new lesson for a specific course
router.post(
  "/:id/lessons",
  upload.single("lessonpic"),
  [authmiddleware],

  async (req, res) => {
    try {
      const { error } = checklessonvalidation(req.body);
      if (error) {
        return res.status(400).send(error.message);
      }
      const validate = await mongoose.isValidObjectId(req.params.id);
      if (!validate) {
        return res.status(400).send("Invalid course id");
      }

      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).send("Course not found");
      }
      const maxOrderLesson = await Lessons.findOne(
        { CourseId: course._id },
        {},
        { sort: { order: -1 } }
      );
      console.log(maxOrderLesson);
      const defaultOrder = maxOrderLesson ? maxOrderLesson.order + 1 : 1;
      console.log(defaultOrder);
      const upload = await cloudinary.uploader.upload(req.file.path);
      const lesson = new Lessons({
        CourseId: course._id,
        title: req.body.title,
        content: req.body.content,
        image: upload.secure_url,
        Video_url: req.Video_url,
        order: defaultOrder,
      });

      const result = await lesson.save();
      res.send(result);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Create a new course
router.post(
  "",
  upload.single("coursepic"),
  authmiddleware,

  async (req, res) => {
    try {
      const { error } = ValidateCourse(req.body);

      if (error) {
        return res.status(400).send(error.message);
      }

      const upload = await cloudinary.uploader.upload(req.file.path);
      const course = new Course({
        name: req.body.name,
        coursepic: upload.secure_url,
        description: req.body.description,
        Author: req.user._id,
        Price: req.body.Price,
      });

      const response = await course.save();
      res.send(response);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
      console.log(error);
    }
  }
);

module.exports = router;
