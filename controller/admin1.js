const Admin = require("../model/admin");

const adminLogin = async(req,res)=>{
    const {username,password} = req.body;
    if(!username || !password){
        return res.status(400).json({
            message: 'Please provide username and password'
        })
    }
    try {
        const {token,role} = await Admin.matchPasswordGenerateToken(username,password);
        return res.status(200).json({token,role});
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid username or password',
        })
    }
}

const adminData = async(req,res)=>{
    const {username} = req.params;
    try {
      const user = await Admin.findOne({username: username});
      user.password = undefined;
        return res.status(200).json({user});
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid username',
        })
    }
}


module.exports = {adminLogin, adminData}