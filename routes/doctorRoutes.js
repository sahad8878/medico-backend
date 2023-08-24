const express = require("express");

const {
  doctorDetails,
  getDepartments,
  doctorStatusChecking,
  getDoctorDetails,
  getAppointments,
  checkedAppointment,
  cancelAppointment,
  postDoctorAvailability,
  getScheduleDetails,
  deleteScheduleTime,
  dayScheduleDisable,
  dayScheduleActivate,
  getDoctorAppointmentHistory,
  updateDoctorDetails,
  getDashboardDetails
} = require("../controller/doctorController");

const doctorAuthmiddlwares = require("../middlewares/doctorAuthmiddlwares");

// route object
const router = express.Router();

// routes

// Get Departments || GET

router.get("/getdepartments", getDepartments);

// Doctor schedul || post 

router.post("/postDoctorAvailability",doctorAuthmiddlwares,postDoctorAvailability)

// Doctor Details || post

router.post("/doctorDetails",doctorAuthmiddlwares, doctorDetails);

// Doctor Status Checking || Get

router.get("/statusChecking",doctorAuthmiddlwares, doctorStatusChecking);


// get doctor profile details || GET

router.get("/getDoctorDetails/:doctorId",doctorAuthmiddlwares,getDoctorDetails)

// Get appointment informations || GET

router.get('/getAppointments',doctorAuthmiddlwares,getAppointments)

// accept appointment || PATCH

router.patch('/checkedAppointment',doctorAuthmiddlwares,checkedAppointment)

// reject appointment || PATCH

router.patch('/cancelAppointment',doctorAuthmiddlwares,cancelAppointment)


// get doctor time schedul  || GET

router.get('/getScheduleDetails',doctorAuthmiddlwares,getScheduleDetails)

// delete doctor time schedul || DELETE 

router.delete('/deleteScheduleTime',doctorAuthmiddlwares,deleteScheduleTime)

// disabel day schedul || PATCH

router.patch('/dayScheduleDisable',doctorAuthmiddlwares,dayScheduleDisable)

// acivate day schedul || PATCH 

router.patch('/dayScheduleActivate',doctorAuthmiddlwares,dayScheduleActivate)

// Doctor appointments history || GET

router.get("/getDoctorAppointmentHistory",doctorAuthmiddlwares,getDoctorAppointmentHistory)


// Update Doctor Detials || POST

router.patch("/updateDoctorDetails",doctorAuthmiddlwares,updateDoctorDetails)

// Get Dashbard Details || GET

router.get("/getDashboardDetails",doctorAuthmiddlwares,getDashboardDetails)

module.exports = router;
