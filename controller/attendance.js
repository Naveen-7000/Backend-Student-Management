const Student = require("../model/student");
const Attendance = require("../model/attendance");
const Subject = require("../model/subject");

const markAttendance = async (req, res) => {
  const { studentId, date, attendedSubjects } = req.body;

  try {

    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }


    // Find the corresponding subject documents based on attendedSubjects array
    const attendedSubjectDocuments = await Subject.find({
      name: { $in: attendedSubjects },
    });

    // Extract the IDs of the subject documents
    const attendedSubjectIds = attendedSubjectDocuments.map(
      (subject) => subject._id
    );
 // Find the absent subject documents
 const absentSubjectDocuments = await Subject.find({
  _id: { $nin: attendedSubjectIds }, // Exclude attended subjects
});

// Extract the IDs of the absent subject documents
const absentSubjectIds = absentSubjectDocuments.map(
  (subject) => subject._id
);


    // Create or update attendance for the specified date
    const attendance = await Attendance.findOneAndUpdate(
      { student: studentId, date },
      { $set: { attendedSubjects: attendedSubjectIds, absentSubjects: absentSubjectIds } },
      { upsert: true, new: true }
    );

    await attendance.save();

    return res.status(200).json({ attendance });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};

// user can get their own all attendance list
const getAttendance = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      message: "Please provide id",
    });
  }

  try {
    const allAttendance = await Attendance.find({ student: id })
    .populate('attendedSubjects', 'name')
    .populate('absentSubjects', 'name');
    return res.status(200).json({ allAttendance });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { markAttendance, getAttendance };
