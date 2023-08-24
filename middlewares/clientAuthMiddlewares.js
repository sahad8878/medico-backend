
 const JWT = require('jsonwebtoken');


module.exports = async (req, res, next) => {
try {
 
  const token = req.headers["accesstoken"];

  JWT.verify(token, process.env.JWT_SECRET,(err, decode) => {
    if(err){
      return res.status(200).send({
        message: "Auth Failed",
        success: false
      })
    }else{
      req.body.userId = decode.id
      next()
    }
  })
} catch (error) {
  console.log(error);
  return res.status(401).send({
    message: "Auth Failed",
    success: false
  })
}
}
























// // JWT middleware
// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization;
//   if (!token) {
//     console.log("Authorization failed");
//     return res.status(401).json({ message: 'Authorization failed' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//         console.log('Authorization failed');
//       return res.status(401).json({ message: 'Authorization failed' });
//     }

//     req.user = decoded;
//     next();
//   });
// };

// module.exports = authMiddleware;