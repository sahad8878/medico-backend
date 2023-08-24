const mongoose = require("mongoose");
const DoctorModel = require("../model/doctorModel");
const DepartmentModel = require("../model/departmentModel");
const AppointmentModel = require("../model/appointmentModel");
const ClientModel = require("../model/clientModel");

// post doctor details
const doctorDetails = async (req, res) => {
  try {
    const { education, address, doctorImg, consultationFees } = req.body;

    if (education && address && doctorImg && consultationFees) {
      const doctor = await DoctorModel.findByIdAndUpdate(
        req.body.doctorId,
        {
          $set: {
            education,
            address,
            doctorImg,
            consultationFees,
            status: "active",
          },
        },
        { new: true }
      ).then(async (doctor) => {
        let spec = doctor.specialization.trim();
        if (doctor) {
          let regExp = new RegExp(spec, "i");

          const department = await DepartmentModel.findOne({
            department: { $regex: regExp },
          });
          if (!department.doctors.includes(doctor._id)) {
            department.doctors.push(doctor._id);
          } else {
            console.log("doctor allready exist");
          }
          department.save();
          res
            .status(201)
            .send({ message: "your details have been saved", success: true });
        } else {
          return res
            .status(200)
            .send({ message: "No doctor exist ", success: false });
        }
      });
    } else {
      return res
        .status(200)
        .send({ message: "All fields must be filled", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `postDoctorDetails controller ${error.message}`,
    });
  }
};

// Doctor status checking

const doctorStatusChecking = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const doctor = await DoctorModel.findById(doctorId);
    let doctorStatus;

    if (doctor) {
      if (doctor.block === false) {
        if (doctor.status === "rejected") {
          doctorStatus = doctor.status;
        }
        if (doctor.status === "pending") {
          doctorStatus = doctor.status;
        }
        if (doctor.status === "approved") {
          doctorStatus = doctor.status;
        }
        if (doctor.status === "active") {
          doctorStatus = doctor.status;
        }
      } else {
        doctorStatus = "blocked";
      }

      res.status(201).send({ doctorStatus, doctor, success: true });
    } else {
      res.status(200).send({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `checkDoctorStatus controller ${error.message}`,
    });
  }
};

// get Doctors

const getDoctorDetails = async (req, res) => {
  try {
    const did = mongoose.Types.ObjectId(req.params.doctorId.trim());
    const doctor = await DoctorModel.findById(did);

    if (doctor) {
      res.status(201).send({ doctor, success: true });
    } else {
      return res
        .status(200)
        .send({ message: `couldnt find Doctor `, success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `client getDoctorDetails  controller ${error.message}`,
    });
  }
};

// find doctor appointment

const getAppointments = async (req, res) => {
  try {
    const pendingAppointments = await AppointmentModel.find({
      doctor: req.body.doctorId,
      status: "confirmed",
    })
      .populate("client")
      .sort({ updatedAt: -1 });
    if (pendingAppointments) {
      res.status(201).send({ pendingAppointments, success: true });
    } else {
      return res
        .status(200)
        .send({ message: "No pendingDoctors", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getAppointment controller ${error.message}`,
    });
  }
};

// Accept  Appoiontments

const checkedAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findByIdAndUpdate(
      req.body.id,
      { status: "checked" },
      { new: true }
    );
    if (appointment) {
      res.status(201).send({
        message: ` mark as Checked`,
        success: true,
      });
    } else {
      return res.status(200).send({
        message: `Patient  doesnot exist`,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `AcceptAppointment controller ${error.message}`,
    });
  }
};

// Reject Appointment

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findByIdAndUpdate(
      req.body.id,
      { status: "cancelled" },
      { new: true }
    );

    if (appointment) {
      const client = await ClientModel.findById(appointment.client);

      if (client.wallet === 0) {
        await ClientModel.findByIdAndUpdate(
          appointment.client,
          { wallet: appointment.consultationFees },
          { new: true }
        );
      } else {
        await ClientModel.findOneAndUpdate(
          { _id: appointment.client },
          {
            $inc: {
              wallet: appointment.consultationFees,
            },
          }
        );
      }
      const doctor = await DoctorModel.findById(appointment.doctor);

      const notifications = client.notifications;
      notifications.push({
        type: "cancelAppointment",
        message: `${doctor.fName} ${doctor.lName} has canceled the ${appointment.date} ${appointment.time} booking `,
      });
      const newClient = await ClientModel.findByIdAndUpdate(
        appointment.client,
        {
          notifications,
        }
      );

      res.status(201).send({
        message: ` Patient Booking cancelled`,
        count: newClient.notifications.length,
        success: true,
      });
    } else {
      return res.status(200).send({
        message: `Patient  doesnot exist`,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `rejectDoctorAppointment controller ${error.message}`,
    });
  }
};

// Get Departments

const getDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.find().sort({ updatedAt: -1 });
    if (departments) {
      res.status(201).send({ departments, success: true });
    } else {
      return res
        .status(200)
        .send({ message: "No Departments ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getDepartments controller ${error.message}`,
    });
  }
};

// post doctor schedule

const postDoctorAvailability = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const { selectedDay, timings } = req.body;

    const doctorData = await DoctorModel.findOne({ _id: doctorId });
    const existingDay = doctorData.availablity.find(
      (day) => day.day === selectedDay
    );

    if (existingDay) {
      existingDay.time.push(
        ...timings.map((timing) => ({
          start: new Date(`2023-03-01T${timing.startTime}:00Z`),
          end: new Date(`2023-03-01T${timing.endTime}:00Z`),
          slots: timing.slots,
        }))
      );
    } else {
      doctorData.availablity.push({
        day: selectedDay,
        time: timings.map((timing) => ({
          start: new Date(`2023-03-01T${timing.startTime}:00Z`),
          end: new Date(`2023-03-01T${timing.endTime}:00Z`),
          slots: timing.slots,
        })),
      });
    }

    const doctor = new DoctorModel(doctorData);
    await doctor.save();
    console.log(doctor);
    if (doctor) {
      res
        .status(201)
        .send({ message: "Your Time schedule added ", success: true });
    } else {
      return res
        .status(200)
        .send({ message: "No doctor Exist  ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `postDoctorAvailability controller ${error.message}`,
    });
  }
};

// Get schedule details
const getScheduleDetails = async (req, res) => {
  try {
    const doctor = await DoctorModel.findOne({ _id: req.body.doctorId });

    const schedule = doctor.availablity;
    if (schedule) {
      res.status(201).send({ schedule, success: true });
    } else {
      return res
        .status(200)
        .send({ message: "No doctor Exist  ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `postDoctorAvailability controller ${error.message}`,
    });
  }
};

// delete schedul time
const deleteScheduleTime = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const timingId = req.query.timingId;
    const doctor = await DoctorModel.findOne({ _id: doctorId });

    if (!doctor) {
      return res
        .status(200)
        .send({ message: " doctor not Exist  ", success: false });
    } else {
      doctor.availablity.forEach((day) => {
        day.time.pull({ _id: timingId });
      });
      doctor.availablity.forEach((day, index) => {
        if (day.time.length === 0) {
          doctor.availablity.splice(index, 1);
        }
      });

      doctor.save().then(() => {
        res
          .status(201)
          .send({ message: "Your Timing is removed", success: true });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `deleteScheduleTime controller ${error.message}`,
    });
  }
};

// day schedule disable
const dayScheduleDisable = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const dayId = req.body.dayId;
    const doctor = await DoctorModel.updateOne(
      { _id: doctorId, "availablity._id": dayId },
      { $set: { "availablity.$.status": "inActive" } }
    );
    if (doctor) {
      res.status(201).send({ message: "Day is inactivated", success: true });
    } else {
      return res
        .status(200)
        .send({ message: " doctor not Exist  ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `postDoctorAvailability controller ${error.message}`,
    });
  }
};

const dayScheduleActivate = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const dayId = req.body.dayId;
    const doctor = await DoctorModel.updateOne(
      { _id: doctorId, "availablity._id": dayId },
      { $set: { "availablity.$.status": "active" } }
    );
    if (doctor) {
      res.status(201).send({ message: "Day is activated", success: true });
    } else {
      return res
        .status(200)
        .send({ message: " doctor not Exist  ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `postDoctorAvailability controller ${error.message}`,
    });
  }
};

const getDoctorAppointmentHistory = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;

    const appointmentHistory = await AppointmentModel.find({
      doctor: doctorId,
      status: { $nin: ["confirmed"] },
    })
      .populate("client")
      .sort({ updatedAt: -1 });
    if (appointmentHistory) {
      res.status(201).send({ appointmentHistory, success: true });
    } else {
      return res
        .status(200)
        .send({ message: "No notifications Exist  ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getDoctorAppointmentHistory controller ${error.message}`,
    });
  }
};

const updateDoctorDetails = async (req, res) => {
  try {
    const {
      fName,
      lName,
      specialization,
      experience,
      location,
      number,
      education,
      address,
      consultationFees,
    } = req.body;
    if (
      fName &&
      lName &&
      specialization &&
      experience &&
      location &&
      number &&
      education &&
      address &&
      consultationFees
    ) {
      const doctor1 = await DoctorModel.findById(req.body.doctorId);

      if (doctor1.specialization !== specialization) {
        const regExp = new RegExp(specialization.trim(), "i");
        const department = await DepartmentModel.findOne({
          department: { $regex: regExp },
        });

        if (!department.doctors.includes(req.body.doctorId)) {
          department.doctors.push(req.body.doctorId);
        } else {
          console.log("doctor allready exist");
        }
        department.save();
        const dbRegExp = new RegExp(doctor1.specialization.trim(), "i");
        const dBdepartment = await DepartmentModel.findOne({
          department: { $regex: dbRegExp },
        });
        const doctorIndex = dBdepartment.doctors.indexOf(req.body.doctorId);
        if (doctorIndex !== -1) {
          dBdepartment.doctors.splice(doctorIndex, 1);
          await dBdepartment.save();
        } else {
          console.log("Doctor not found in department");
        }
      }
      const doctor = await DoctorModel.findByIdAndUpdate(
        req.body.doctorId,
        req.body,
        { new: true }
      );
      if (!doctor) {
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
      message: `updateDoctorDetails  controller ${error.message}`,
    });
  }
};

const getDashboardDetails = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const totalAppointments = await AppointmentModel.find({
      doctor: doctorId,
    }).count();
    const checkedAppointments = await AppointmentModel.find({
      doctor: doctorId,
      status: { $in: ["checked"] },
    }).count();
    const canceledAppointments = await AppointmentModel.find({
      doctor: doctorId,
      status: { $in: ["cancelled"] },
    }).count();

    const salesReport = await AppointmentModel.aggregate([
      {
        $match: {
          doctor: mongoose.Types.ObjectId(doctorId),
          status: "checked",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalSales: {
            $sum: "$consultationFees",
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          totalSales: 1,
        },
      },
    ]);

    const newSalesReport = salesReport.map((el) => {
      let newEl = { ...el };
      newEl.month = months[newEl.month - 1];
      return newEl;
    });
    res.status(201).send({
      totalAppointments,
      checkedAppointments,
      canceledAppointments,
      salesReport: newSalesReport,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `updateDoctorDetails  controller ${error.message}`,
    });
  }
};
module.exports = {
  getDepartments,
  doctorDetails,
  doctorStatusChecking,
  getDoctorDetails,
  getAppointments,
  checkedAppointment,
  cancelAppointment,
  postDoctorAvailability,
  getScheduleDetails,
  deleteScheduleTime,
  dayScheduleActivate,
  dayScheduleDisable,
  getDoctorAppointmentHistory,
  updateDoctorDetails,
  getDashboardDetails,
};
