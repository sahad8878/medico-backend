const express = require("express");
const {
  getPendingDoctors,
  acceptDoctorAppointment,
  rejectDoctorAppointment,
  getDoctorsDetails,
  getAllAppointments,
  blockDoctor,
  unBlockDoctor,
  getClientDetails,
  blockClient,
  unBlockClient,
  postDepartments,
  getDepartments,
  deleteDepartment,
  putEditDepartment,
  getAdminDashboardDetails
} = require("../controller/adminController");

const adminAuthMiddlewares = require("../middlewares/adminAuthMiddlewares");

// route object
const router = express.Router();


// routes

// Pending Doctor Details || GET

router.get("/getPendingDoctors",adminAuthMiddlewares, getPendingDoctors);

// Accept Doctor Appointment || Patch

router.patch("/acceptAppointment",adminAuthMiddlewares, acceptDoctorAppointment);

// Reject Doctor Appointment || Patch

router.patch("/rejectAppointment",adminAuthMiddlewares, rejectDoctorAppointment);

// Doctor Details || GET

router.get("/getDoctorsDetails",adminAuthMiddlewares, getDoctorsDetails);

// Get full Appointments || GET

router.get("/getAllAppointments",adminAuthMiddlewares,getAllAppointments)

// Block Doctor || PATCH

router.patch("/blockDoctor",adminAuthMiddlewares, blockDoctor);

// UnBlock Doctor || Patch

router.patch("/unBlockDoctor",adminAuthMiddlewares, unBlockDoctor);

// Get Client Details || GEt

router.get("/getClientDetails",adminAuthMiddlewares, getClientDetails);

// Block Client || PATCH

router.patch("/blockClient",adminAuthMiddlewares, blockClient);

// UnBlock Client || Patch

router.patch("/unBlockClient",adminAuthMiddlewares, unBlockClient);

// Adding Departments || Post

router.post("/postDepartments",adminAuthMiddlewares, postDepartments);

// Get Departments || GET

router.get("/getdepartments",adminAuthMiddlewares, getDepartments);

// Delete Department || DELETE

router.delete("/deleteDepartment",adminAuthMiddlewares, deleteDepartment);

// Edit Department || PUT

router.put("/putEditDepartment",adminAuthMiddlewares,putEditDepartment)

// get Admin Dashboard Details || GET

router.get('/getAdminDashboardDetails',adminAuthMiddlewares,getAdminDashboardDetails)

module.exports = router;
