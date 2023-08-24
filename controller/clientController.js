const mongoose = require("mongoose");
const DepartmentModel = require("../model/departmentModel");
const DoctorModel = require("../model/doctorModel");
const AppointmentModel = require("../model/appointmentModel");
const ClientModel = require("../model/clientModel");

const moment = require("moment");

//get client details

const getClietProfile = async (req, res) => {
  try {
    const client = await ClientModel.findById(req.body.userId);
    if (client) {
      res.status(201).send({ client, success: true });
    } else {
      return res
        .status(200)
        .send({ message: "No Departments ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `client getDepartments  controller ${error.message}`,
    });
  }
};

// update client details

const patchUpdateClientDetails = async (req, res) => {
  try {
    const { fName, lName, number, address, clientImage, age } = req.body;

    if ((address, clientImage, age)) {
      const client = await ClientModel.findByIdAndUpdate(
        req.body.userId,
        {
          $set: {
            fName,
            lName,
            number,
            address,
            address,
            clientImage,
            age,
          },
        },
        { new: true }
      );
      if (!client) {
        return res
          .status(200)
          .send({ message: "No Client exist ", success: false });
      } else {
        res
          .status(201)
          .send({ message: "your details have been saved", success: true });
      }
    } else {
      return res
        .status(200)
        .send({ message: "All fields must be filled", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `client getDepartments  controller ${error.message}`,
    });
  }
};

// get departments
const getdepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.find();
    if (departments) {
      res.status(201).json(departments);
    } else {
      return res
        .status(200)
        .send({ message: "No Departments ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `client getDepartments  controller ${error.message}`,
    });
  }
};

// get Doctor Details 
const getDoctorDetails = async (req, res) => {
  try {
    const did = mongoose.Types.ObjectId(req.params.doctorId.trim());
    const doctor = await DoctorModel.findById(did);
    const availableDays = [];
    doctor.availablity.forEach((day) => {
      if (day.status == "active") availableDays.push(day.day);
    });
    console.log(availableDays);
    if (doctor) {
      res.status(201).send({ doctor, availableDays, success: true });
    } else {
      return res
        .status(200)
        .send({ message: `couldnt find Doctor `, success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `client getDepartmentDoctors  controller ${error.message}`,
    });
  }
};

// Get  Experienced Doctors

const getExperiencedDoctors = async (req, res) => {
  try {
    let doctors = await DoctorModel.find({
      status: "active",
      experience: { $gte: "2 years" },
    });
    if (doctors) {
      res.status(201).send({ doctors, success: true });
    } else {
      return res
        .status(200)
        .send({ message: `couldnt find Doctors `, success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `client getSearchDoctor  controller ${error.message}`,
    });
  }
};

// get all notifications

const getAllNotifications = async (req, res) => {
  try {
    const client = await ClientModel.findOne({ _id: req.body.userId });
    const clientNotifications = client.notifications;
    const clientSeenNotification = client.seenNotifications;
    res
      .status(200)
      .send({ success: true, clientNotifications, clientSeenNotification });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getAllNotifications  controller ${error.message}`,
    });
  }
};

// all notifications read

const notificationMarkAllRead = async (req, res) => {
  try {
    const client = await ClientModel.findOne({ _id: req.body.userId });
    
    const seenNotifications = client.seenNotifications;
    const notifications = client.notifications;
    seenNotifications.push(...notifications);
    client.notifications = [];
    client.seenNotifications = notifications;
    const updatedClient = await client.save();
    res
      .status(200)
      .send({ success: true, message: "all notifications marked as read" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `notificationMarkAllRead  controller ${error.message}`,
    });
  }
};

//all notification Delete
const notificationDeleteAllRead = async (req, res) => {
  try {
    const client = await ClientModel.findOne({ _id: req.body.userId });
    client.seenNotifications = [];
    const updateClient = await client.save();
    res
      .status(200)
      .send({ success: true, message: "Notifications Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `notificationDeleteAllRead  controller ${error.message}`,
    });
  }
};

const  getDepartmentDoctors = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder || "desc";
    const feeFilter = req.query.feeFilter || "";
    const searchData = req.query.searchLocation || "";

    const did = mongoose.Types.ObjectId(departmentId.trim());
    const department = await DepartmentModel.findOne({ _id: did });

    const query = {
      specialization: department.department.trim(),
      status: "active",
    };
    if (feeFilter !== "") {
      const [minFee, maxFee] = feeFilter.split("-").map(parseFloat);
      if (!isNaN(minFee)) {
        query.consultationFees = { $gte: minFee };
      }
      if (!isNaN(maxFee)) {
        query.consultationFees = query.fee || {};
        query.consultationFees.$lte = maxFee;
      }
    }
    if (searchData !== "") {
      query.location = { $regex: new RegExp(`^${searchData}.*`, "i") };
    }

    const doctors = await DoctorModel.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      data: doctors,
      currentPage: page,
      totalPages: Math.ceil((await DoctorModel.countDocuments(query)) / limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `notificationDeleteAllRead  controller ${error.message}`,
    });
  }
};

module.exports = {
  getClietProfile,
  patchUpdateClientDetails,
  getdepartments,
  getDoctorDetails,
  getExperiencedDoctors,
  getAllNotifications,
  notificationMarkAllRead,
  notificationDeleteAllRead,
  getDepartmentDoctors,
};
