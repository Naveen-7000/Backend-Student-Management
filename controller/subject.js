const Subject = require("../model/subject");

const getAllSubject = async(req,res,next)=>{
    try {
        const subjects = await Subject.find({});
        return res.status(200).json({subjects});
    } catch (error) {
        return res.status(400).json({
            message: 'Something went wrong',
        })
    }
}

module.exports = {getAllSubject};