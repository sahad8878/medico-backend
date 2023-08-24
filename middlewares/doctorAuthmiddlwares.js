const JWT = require('jsonwebtoken');


module.exports = async (req, res, next) => {
try {
 
  const token = req.headers["doctortoken"];

  JWT.verify(token, process.env.JWT_SECRET,(err, decode) => {
    if(err){
      return res.status(200).send({
        message: "Auth Failed",
        success: false
      })
    }else{
      req.body.doctorId = decode.id
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

