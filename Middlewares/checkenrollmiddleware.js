const jwt = require("jsonwebtoken");
const {
  EnrolledCourse,
  checkEnrolledvalidation,
} = require("../Models/EnrolledCourse");
const { Course, ValidateCourse } = require("../Models/Course");
async function checkenrollmiddleware(req, res, next) {
  try {
    const course = await Course.findById(req.params.id);

    const enrollment = await EnrolledCourse.findOne({
      CourseId: course._id,
      UserId: req.user._id,
    });
    if (!enrollment) {
      return res.status(401).send("you havent enrolled for this course");
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = checkenrollmiddleware;
