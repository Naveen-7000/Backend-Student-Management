const {Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum:['admin'],
        default: 'admin',
    }
},{timestamps: true})

adminSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

adminSchema.static('matchPasswordGenerateToken',async function(username,password){
    const user = await this.findOne({username});
    if(!user){
        throw new Error('Invalid username');
    }
    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        throw new Error('Invalid password');
    }
    // generate a jwt token and send back to the user
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn: 60 * 60 * 24 * 30,
    });

    return {token,role:user.role};
})

const Admin = model('admin', adminSchema);

module.exports = Admin;
