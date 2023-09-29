const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const Gradeschema = new mongoose.Schema({
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
  score: {
    type: Number,
    required: true,
  },
  DateJoined: {
    type: Date,
    default: Date.now,
  },
});
const Grade = mongoose.model("Grade", Gradeschema);
function checkGradevalidation(body) {
  const schema = Joi.object({
    CourseId: Joi.objectId().required(),
    UserId: Joi.objectId().required(),
    score: Joi.number().required(),
  });
  return schema.validate(body);
}
module.exports.checkGradevalidation = checkGradevalidation;
module.exports.Grade = Grade;
