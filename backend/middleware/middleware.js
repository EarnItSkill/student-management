// middlewares/verifyStudent.js
export const verifyStudent = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    const student = await studentCollection.findOne({ studentId: userId });

    if (!student) {
      return res.status(403).send({
        success: false,
        message: "কোর্স অ্যাক্সেস করার অনুমতি নেই।",
      });
    }

    // student ডাটা পরবর্তী রাউটে ব্যবহার করতে চাইলে req.student হিসেবে পাঠাও
    req.student = student;
    next();
  } catch (error) {
    console.error("verifyStudent Error:", error);
    res.status(500).send({
      success: false,
      message: "সার্ভার এরর (verifyStudent)",
    });
  }
};
