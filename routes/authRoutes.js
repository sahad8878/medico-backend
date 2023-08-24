const express = require("express");
const {
  loginController,
  signupController,
  adminLogin,
  doctorSignup,
  doctorLogin,
} = require("../controller/authController");


// router object
const router = express.Router();


// Auth routes

// CLIENT LOGIN || POST

router.post("/clientLogin", loginController);

// CLIENT SIGNUP || POST

router.post("/clientSignup", signupController);


// ADMIN LOGIN || POST

router.post("/admin", adminLogin);


// DOCTOR SIGNUP || POST
router.post("/doctorSignup", doctorSignup);

// DOCTOR  LOGIN || POST

router.post("/doctorLogin", doctorLogin);



module.exports = router;