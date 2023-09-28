const mongoose = require("mongoose");
const Joi = require("joi");

Joi.objectId = require("joi-objectid")(Joi);
const EnrolledCourseschema = new mongoose.Schema({
  CourseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  completedlessons: [
    {
      lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lessons",
      },
      score: {
        type: Number,
      },
    },
  ],

  DateJoined: {
    type: Date,
    default: Date.now,
  },
});
const EnrolledCourse = mongoose.model("EnrolledCourse", EnrolledCourseschema);

function checkEnrolledvalidation(body) {
  const schema = Joi.object({
    CourseId: Joi.objectId().required(),
    UserId: Joi.objectId().required(),
  });
  return schema.validate(body);
}
module.exports.checkEnrolledvalidation = checkEnrolledvalidation;
module.exports.EnrolledCourse = EnrolledCourse;
