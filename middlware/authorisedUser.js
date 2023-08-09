const jwt = require("jsonwebtoken");
const User = require("../model/admin");

const authorisedUser = async(req, res, next) => {
  const Btoken = req.headers['authorization'];
  // remove the Bearer from the token
  const token = Btoken.split(' ')[1];

  if(!token){
      return res.status(401).json({
          message: 'You are not authorised'
      })
  }

  try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.id);

      if (!user) return res.status(401).send('Invalid user.');
      user.password =undefined;
      req.user = user; // Add user data to the req object
      next();
    } catch (error) {
      res.status(400).send('Invalid token.');
      next();
    }
  }

  module.exports = authorisedUser;