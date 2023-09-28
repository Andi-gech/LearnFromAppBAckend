const mongoose = require("mongoose");
const Joi = require("joi");

Joi.objectId = require("joi-objectid")(Joi);

const optionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [optionSchema], // Array of option documents
});

const quizSchema = new mongoose.Schema({
  LessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lessons",
    required: true,
  },
  DateCreated: {
    type: Date,
    default: Date.now,
  },
  Time: {
    type: Number,
    min: 3,
    default: 3,
  },
  questions: [questionSchema], // Array of question documents
});

const Quizes = mongoose.model("Quizes", quizSchema);

function checkQuizValidation(body) {
  const schema = Joi.object({
    LessonId: Joi.objectId(),
    Time: Joi.number().required(),
    questions: Joi.array().items(
      Joi.object({
        questionText: Joi.string().required(),
        options: Joi.array().items(
          Joi.object({
            optionText: Joi.string().required(),
            isCorrect: Joi.boolean().required(),
          })
        ),
      })
    ),
  });
  return schema.validate(body);
}

module.exports.checkQuizValidation = checkQuizValidation;
module.exports.Quizes = Quizes;
