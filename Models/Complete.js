const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require("joi-objectid")(Joi);
const CompletedCourseSchema = new mongoose.Schema({
  CourseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  completedlessons: [
    {
      lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lessons",
      },
    },
  ],
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const Completedcourse = new mongoose.model(
  "Completedcourse",
  CompletedCourseSchema
);

function ValidateCompletecoursedata(body) {
  const Schema = Joi.object({
    completedlessons: Joi.array().items(
      Joi.object({
        lesson: Joi.objectId().required(),
      })
    ),
    CourseId: Joi.objectId().required(),
    User: Joi.objectId().required(),
  });
  return Schema.validate(body);
}

module.exports.Completedcourse = Completedcourse;
module.exports.ValidateCompletecoursedata = ValidateCompletecoursedata;
