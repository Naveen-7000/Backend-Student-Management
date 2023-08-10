const Subject = require("../model/subject");
const Student = require("../model/student");

const createStudent = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Only admin can create students.",
    });
  }

  const { username, password, name, age, subjects, className } = req.body;
  if (!username || !password || !name || !age || !className) {
    return res.status(400).json({
      message: "Please provide all required information",
    });
  }

  if (!subjects) {
    return res.status(400).json({
      message: "Please provide subjects",
    });
  }


  if (subjects.length < 1) {
    return res.status(400).json({
      message: "Please provide at least one subject",
    });
  }

  try {
    // Create the student
    const student = await Student.create({
      username,
      password,
      name,
      age,
      className,
    });

    // Create subjects and associate them with the student
    for (const subjectName of subjects) {
      // Check if the subject already exists
      let existingSubject = await Subject.findOne({ name: subjectName });

      if (!existingSubject) {
        // If subject doesn't exist, create and save it
        existingSubject = new Subject({ name: subjectName });
        await existingSubject.save();
      }

      student.subjects.push(existingSubject);
    }

    await student.save();
    return res.status(200).json({ student });
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};

// student login handlar

const studentLogin = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      message: "Please provide username and password",
    });
  }

  try {
    const {token} = await Student.matchPasswordGenerateToken(username,password);
    return res.status(200).json({token,username});
} catch (error) {
    return res.status(400).json({
        message: 'Invalid username or password',
    })
}
}


const getStudent = async (req, res, next) => {
   const { username } = req.params;
    if (!username) {
      return res.status(400).json({
        message: "Please provide username",
      });
    }

    try {
      const student = await Student.findOne({ username }).populate("subjects");
      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }

      return res.status(200).json({ student });
    } catch (error) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    }
};

const getAllStudents = async (req, res, next) => {
  const students = await Student.find({}).populate("subjects");
  return res.status(200).json({ students });
  // try {
  // } catch (error) {
  //   return res.status(400).json({
  //     message: "Something went wrong",
  //   });
  // }
};

module.exports = {createStudent,getStudent,getAllStudents, studentLogin};
