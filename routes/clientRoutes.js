const express = require("express");

const {
  getClietProfile,
  patchUpdateClientDetails,
  getdepartments,
  getDoctorDetails,
  getExperiencedDoctors,
  getAllNotifications,
  notificationMarkAllRead,
  notificationDeleteAllRead,
  getDepartmentDoctors
} = require("../controller/clientController");

const {
  verifyAppointment,
  availableSlot,
  postAppointment,
  getConfirmedAppointments,
  patchCancelAppointment

} = require("../controller/clientAppointmentController");

const clientAuthMiddlewares = require("../middlewares/clientAuthMiddlewares");

// router object
const router = express.Router();

// routes

// Appointments || POST

router.post("/verifyAppointment", clientAuthMiddlewares, verifyAppointment);

// confirm client appointment || PATCH

router.post(
  "/postAppointment",
  clientAuthMiddlewares,
  postAppointment
);


// get user information || GET

router.get("/getClietProfile", clientAuthMiddlewares, getClietProfile);

// Get Departments || GET
router.get("/getdepartments", clientAuthMiddlewares, getdepartments);

// update client Details || POST

router.post(
  "/updateClientDetails",
  clientAuthMiddlewares,
  patchUpdateClientDetails
);


// Get  Doctor Details || GET

router.get(
  "/getDoctorDetails/:doctorId",
  clientAuthMiddlewares,
  getDoctorDetails
);



// Get department doctors || GET

router.get('/getDepartmentDoctors/:id/doctors',clientAuthMiddlewares,getDepartmentDoctors)

// get Experienced Doctors || GET

router.get(
  "/getExperiencedDoctors",
  clientAuthMiddlewares,
  getExperiencedDoctors
);

// Check available Slotes || GET

router.get(
  "/availableSlot/:doctorId/:selectedDay",
  clientAuthMiddlewares,
  availableSlot
);




// get confirmed client appointments || GET

router.get(
  "/getConfirmedAppointments",
  clientAuthMiddlewares,
  getConfirmedAppointments
);

// cancet appointment || PATCH

router.patch('/patchCancelAppointment',
clientAuthMiddlewares,
patchCancelAppointment)

//get  Notifications || GET

router.get('/getAllNotifications',
clientAuthMiddlewares,
getAllNotifications)


// notifications mark all read || PATCH
router.patch('/notificationMarkAllRead',
clientAuthMiddlewares,
notificationMarkAllRead)

// notifications Delete all read || PATCH
router.patch('/notificationDeleteAllRead',
clientAuthMiddlewares,
notificationDeleteAllRead)

module.exports = router;
