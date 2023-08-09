const {Schema,model} = require('mongoose');

const attendanceSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'student' },
  date: Date,
  attendedSubjects: [{ type: Schema.Types.ObjectId, ref: 'subject' }],
});

const Attendance = model('attendance', attendanceSchema);
module.exports = Attendance;
