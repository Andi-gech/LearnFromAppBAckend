const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Quizes, checkQuizValidation } = require("../Models/Quizes"); // Update the path to your Quiz model
const { Lessons, checklessonvalidation } = require("../Models/Lessons");

// Create a new quiz
router.post("/:lessonid", async (req, res) => {
  // Validate the request body using Joi
  const { error } = checkQuizValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const lesson = await Lessons.findById(req.params.lessonid);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    const quiz = new Quizes({
      LessonId: req.params.lessonid,
      Time: req.body.Time,
      questions: req.body.questions.map((question) => ({
        questionText: question.questionText,
        options: question.options,
      })),
    });
    const savedQuiz = await quiz.save();
    res.status(201).json(savedQuiz);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all quizzes
router.get("/bylesson/:lessonid", async (req, res) => {
  try {
    const quizzes = await Quizes.findOne({ LessonId: req.params.lessonid });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/check/:quizid", async (req, res) => {
  try {
    const quizzes = await Quizes.findById(req.params.quizid);
    const totalScore = req.body.userAnswers.reduce((score, userAnswer) => {
      const question = quizzes.questions.find(
        (q) => q._id.toString() === userAnswer.question.toString()
      );

      if (question) {
        const correctOption = question.options.find(
          (option) => option.isCorrect
        );

        if (
          correctOption &&
          correctOption._id.toString() === userAnswer.selectedanswer.toString()
        ) {
          return score + 1;
        }
      }

      return score;
    }, 0);

    const percentile = (totalScore / quizzes.questions.length) * 100;
    console.log(percentile);
    res.json(percentile);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a single quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quizes.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a quiz by ID
router.put("/:id", async (req, res) => {
  // Validate the request body using Joi
  const { error } = checkQuizValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const quiz = await Quizes.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a quiz by ID
router.delete("/:id", async (req, res) => {
  try {
    const quiz = await Quizes.findByIdAndRemove(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
