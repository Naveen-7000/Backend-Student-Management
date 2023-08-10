const {Schema,model,} = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const studentSchema = new Schema({
  name: String,
  age: Number,
  className: String,
  username: String,
  password: String,
  subjects: [{ type: Schema.Types.ObjectId, ref: 'subject' }]
},{timestamps: true});

studentSchema.pre('save', async function(next){
  if(!this.isModified('password')){
      next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password,salt);
  next();
})

studentSchema.static('matchPasswordGenerateToken',async function(username,password){
  const student = await this.findOne({username});
  if(!student){
    throw new Error('Invalid username');
  }
  const isMatch = password === student.password ? true : false;

  if(!isMatch){
      throw new Error('Invalid password');
  }
  // generate a jwt token and send back to the user
  const token = jwt.sign({id:student._id},process.env.JWT_SECRET,{
      expiresIn: 60 * 60 * 24 * 30,
  });

  return {token};
})
const Student = model('student', studentSchema);
module.exports = Student;
