const { Lessons } = require("../Models/Lessons");
const { EnrolledCourse } = require("../Models/EnrolledCourse");

async function checkCompletionMiddleware(req, res, next) {
  try {
    const courseId = req.params.id; // Assuming you have courseId in your route
    const lessonId = req.params.lessonid;

    const lesson = await Lessons.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const order = lesson.order;
    console.log(order);

    const enrollment = await EnrolledCourse.findOne({
      CourseId: courseId,
      UserId: req.user._id,
    });
    console.log("checking completion");
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const completedLessonIds = enrollment.completedlessons.map(
      (completedLesson) => completedLesson._id.toString()
    );

    // Find the previous lesson with a lower order value
    const previousLesson = await Lessons.findOne({
      CourseId: courseId,
      order: order - 1,
    });

    // Check if the previous lesson exists and is completed
    if (
      previousLesson &&
      !completedLessonIds.includes(previousLesson?._id.toString())
    ) {
      return res.status(403).json({ message: "Previous lesson not completed" });
    }

    // If the previous lesson is completed, continue to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = checkCompletionMiddleware;
