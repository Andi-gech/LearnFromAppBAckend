const mongoose = require("mongoose");
const Joi = require("joi");

Joi.objectId = require("joi-objectid")(Joi);
const Lessonschema = new mongoose.Schema({
  CourseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },
  title: {
    type: String,
    required: true,
    min: 3,
  },
  content: {
    type: String,
    required: true,
    min: 3,
  },
  image: {
    type: String,

    min: 3,
  },
  Video_url: {
    type: String,

    min: 3,
  },
  DateJoined: {
    type: Date,
    default: Date.now,
  },
  order: {
    type: Number,
    required: true,
  },
});
const Lessons = mongoose.model("Lessons", Lessonschema);

function checklessonvalidation(body) {
  const schema = Joi.object({
    CourseId: Joi.objectId(),

    content: Joi.string().required().min(10),

    Video_url: Joi.string().min(3),
    title: Joi.string().min(3),
  });
  return schema.validate(body);
}
module.exports.checklessonvalidation = checklessonvalidation;
module.exports.Lessons = Lessons;
