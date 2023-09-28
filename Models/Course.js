const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);
const CourseSchema = new mongoose.Schema({
  name: String,
  created_at: { type: Date, default: Date.now },
  coursepic: String,
  description: String,
  Rating: { type: Number, default: 1 },
  Author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  Price: { type: Number, default: 0 },
});

const Course = new mongoose.model("Courses", CourseSchema);
const Schema = Joi.object({
  name: Joi.string().required().min(3).max(255),

  description: Joi.string().required().min(3),
  Price: Joi.string(),
});
function ValidateCourse(body) {
  return Schema.validate(body);
}

module.exports.Course = Course;
module.exports.ValidateCourse = ValidateCourse;
