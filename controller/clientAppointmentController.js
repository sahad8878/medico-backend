const AppointmentModel = require("../model/appointmentModel");
const DoctorModel = require("../model/doctorModel");
const ClientModel = require("../model/clientModel");

const moment = require("moment");

// post appointments
const verifyAppointment = async (req, res) => {
  try {
    const { date, timeId, doctor } = req.body;
    console.log(req.body);
    const client = req.body.userId;
    const selectedDay = moment(date).format("dddd");
    DoctorModel.findOne(
      {
        _id: doctor,
        "availablity.day": selectedDay,
        "availablity.time._id": timeId,
      },
      {
        "availablity.$": 1,
      }
    ).then(async (doctor) => {
      if (!doctor) {
        res.status(200).send({
          message: "Doctor not found",
          success: false,
        });
        return;
      }

      const availablity = doctor.availablity[0];
      const time = availablity.time.find((t) => t._id == timeId);
      if (!time) {
        res.status(200).send({
          message: "Time not available",
          success: false,
        });
        return;
      }

      const totalSlots = time.slots;
      const toTime = moment(time.start).format(" h:mm a");
      const allreadyBooked = await AppointmentModel.find({
        doctor: doctor,
        date: date,
        time: toTime,
        client: client,
      });
      console.log(allreadyBooked.length, "boooked");
      if (allreadyBooked.length !== 0) {
        res.status(200).send({
          message: "You have already booked this slot",
          success: false,
        });
        return;
      }

      const apointments = await AppointmentModel.find({
        doctor: doctor,
        date: date,
        time: toTime,
      });
      const appointmentsCount = apointments.length;
      if (totalSlots <= appointmentsCount) {
        res.status(200).send({
          message: "The selected slot is no longer available.",
          success: false,
        });
        return;
      }

      res.send({
        schedulTime: toTime,
        token: appointmentsCount + 1,
        message: "Appointment verifyd.",
        success: true,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `client getSearchDoctor  controller ${error.message}`,
    });
  }
};

// post appointments
const postAppointment = async (req, res) => {
  try {
    console.log(req.body, "post appoijnmtnet ");
    const { date, time, doctor, token, consultationFees } = req.body;
    const client = req.body.userId;

    const newAppointment = new AppointmentModel({
      date,
      time,
      doctor,
      token,
      status: "confirmed",
      consultationFees,
      client,
    });
    await newAppointment.save();
    res.send({ message: "Appointment succeffully completed.", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `patchConfirmAppointment controller ${error.message}`,
    });
  }
};

// check available slotes

const availableSlot = async (req, res) => {
  try {
    const { doctorId, selectedDay } = req.params;
    const doctor = await DoctorModel.findById(doctorId);
    const availability = doctor.availablity.find(
      (day) => day.day === selectedDay
    );

    if (!availability) {
      res.status(200).send({
        message: "Doctor is not available on this day.",
        success: false,
      });
      return;
    }
    // return availability for selected day
    res.status(201).send({ availability, success: true });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `client getSearchDoctor  controller ${error.message}`,
    });
  }
};

// get confirmed appointments
const getConfirmedAppointments = async (req, res) => {
  try {
    const clientId = req.body.userId;

    const confirmedAppointments = await AppointmentModel.find({
      client: clientId,
    })
      .populate("doctor")
      .sort({ updatedAt: -1 });
    if (confirmedAppointments) {
      res.status(201).send({ confirmedAppointments, success: true });
    } else {
      return res
        .status(200)
        .send({ message: "No notifications Exist  ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getConfirmedAppointments controller ${error.message}`,
    });
  }
};

// cancel appointments
const patchCancelAppointment = async (req, res) => {
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

      res.status(201).send({
        message: ` Booking cancelled successfull check your wallet  `,
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
      message: `patchCancelAppointment controller ${error.message}`,
    });
  }
};

module.exports = {
  availableSlot,
  verifyAppointment,
  postAppointment,
  getConfirmedAppointments,
  patchCancelAppointment,
};
