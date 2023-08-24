const DepartmentModel = require("../model/departmentModel");
const DoctorModel = require("../model/doctorModel");
const ClientModel = require("../model/clientModel");
const AppointmentModel = require("../model/appointmentModel");

// Get Pending Doctors Details

const getPendingDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const pendingDoctors = await DoctorModel.find({status:"pending"}).sort({
      updatedAt: -1,
    })
    .skip((page - 1) * limit)
    .limit(limit);

    if (pendingDoctors) {
      res.status(201).send({ pendingDoctors,
        currentPage: page,
        totalPages: Math.ceil((await DoctorModel.countDocuments({status:"pending"})) / limit),
        success: true });
    } else {
      return res
        .status(200)
        .send({ message: "No pendingDoctors", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getPendingDoctors controller ${error.message}`,
    });
  }
};

// Accept Doctor Appoiontments

const acceptDoctorAppointment = async (req, res) => {
  try {
    const doctor = await DoctorModel.findByIdAndUpdate(
      req.body.id,
      { status: "approved" },
      { new: true }
    );

    if (doctor) {
      res.status(201).send({
        message: ` Doctor ${doctor.fName} request accepted`,
        success: true,
      });
    } else {
      return res.status(200).send({
        message: `Doctor ${doctor.fName} doesnot exist`,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `AcceptDoctorAppointment controller ${error.message}`,
    });
  }
};

// Reject Doctor requests

const rejectDoctorAppointment = async (req, res) => {
  try {
    const doctor = await DoctorModel.findByIdAndUpdate(
      req.body.id,
      { status: "rejected" },
      { new: true }
    );
    if (doctor) {
      res.status(201).send({
        message: `Doctor ${doctor.fName} request rejected`,
        success: true,
      });
    } else {
      return res.status(200).send({
        message: `Doctor ${doctor.fName} does not exist`,
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

// Get Doctor Details

const getDoctorsDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const query = {
      status: { $nin: ["pending", "rejected"] }
    };

    const doctors = await DoctorModel.find(query)
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

    if (doctors) {
      res.json({ doctors,
        currentPage: page,
        totalPages: Math.ceil((await DoctorModel.countDocuments(query)) / limit),
         success: true });
    } else {
      return res.status(200).send({ message: "No doctors ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getDoctorDetails controller ${error.message}`,
    });
  }
};

// Block doctor

const blockDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findByIdAndUpdate(req.body.id, {
      block: true,
    });
    if (doctor) {
      res
        .status(201)
        .send({ message: `Doctor ${doctor.fName} is Blocked`, success: true });
    } else {
      return res.status(200).send({
        message: `Doctor ${doctor.fName} does not exist`,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `BlockDoctor controller ${error.message}`,
    });
  }
};

// UnBlock Doctor

const unBlockDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.findByIdAndUpdate(req.body.id, {
      block: false,
    });
    if (doctor) {
      res.status(201).send({
        message: `Doctor ${doctor.fName} is unblocked`,
        success: true,
      });
    } else {
      return res.status(200).send({
        message: `Doctor ${doctor.fName} does not exist`,
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `unBlockDoctor controller ${error.message}`,
    });
  }
};

// get Clinet Details

const getClientDetails = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const clients = await ClientModel.find()
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

    if (clients) {
      res.json({ clients,
        currentPage: page,
        totalPages: Math.ceil((await ClientModel.countDocuments()) / limit),
        success: true });
    } else {
      return res.status(200).send({ message: "No Clients ", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getClientDetails controller ${error.message}`,
    });
  }
};

// Block Client

const blockClient = async (req, res) => {
  try {
    const client = await ClientModel.findByIdAndUpdate(req.body.id, {
      block: true,
    });
    if (client) {
      res
        .status(201)
        .send({ message: `${client.fName} is blocked`, success: true });
    } else {
      return res
        .status(200)
        .send({ message: `${client.fName} doesnot exist`, success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `blockClient controller ${error.message}`,
    });
  }
};

// UnBlock Doctor

const unBlockClient = async (req, res) => {
  try {
    const client = await ClientModel.findByIdAndUpdate(req.body.id, {
      block: false,
    });
    if (client) {
      res
        .status(201)
        .send({ message: `${client.fName} is unblocked`, success: true });
    } else {
      return res
        .status(200)
        .send({ message: `${client.fName} doesnot exist`, success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `unBlockClient controller ${error.message}`,
    });
  }
};

// Add Departments
const postDepartments = async (req, res) => {
  try {
    const { department, departmentImg, description } = req.body;
    if (department && departmentImg && description) {
      let regExp = new RegExp(department.trim(), "i");
      let dbDepartment = await DepartmentModel.findOne({
        department: { $regex: regExp },
      });
      if (dbDepartment) {
        return res.status(200).send({
          message: `${dbDepartment.department} Department is already exist`,
          success: false,
        });
      } else {
        const newDepartment = new DepartmentModel({
          department,
          departmentImg,
          description,
        });
        await newDepartment.save().then(() => {
          res.status(201).send({
            message: "New department added successfully",
            success: true,
          });
        });
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
      message: `PostDepartments controller ${error.message}`,
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

// Delete department

const deleteDepartment = async (req, res) => {
  try {
    await DepartmentModel.findByIdAndRemove(req.query.id).then((department) => {
      if (department) {
        res.status(201).send({
          message: `${department.department} Department deleted`,
          success: true,
        });
      } else {
        return res.status(200).send({
          message: `${department.department} Department does not Exist`,
          success: false,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `deleteDepartment controller ${error.message}`,
    });
  }
};

// Edit departmetn

const putEditDepartment = async (req, res) => {
  try {
    const { department, description, departmentImg, departmentId } = req.body;
    if (department && description && departmentImg) {
      let regExp = new RegExp(department.trim(), "i");
      let dep = await DepartmentModel.findOne({
        _id: departmentId,
        department: { $regex: regExp },
      });
      if (dep) {
        await DepartmentModel.updateOne(
          { _id: departmentId },
          {
            $set: {
              department: department,
              description: description,
              departmentImg: departmentImg,
            },
          }
        ).then((department) => {
          if (department) {
            res
              .status(201)
              .send({
                message: " department have been Updated",
                success: true,
              });
          }
        });
      } else {
        let regExp = new RegExp(department.trim(), "i");
        let dbDepartment = await DepartmentModel.findOne({
          department: { $regex: regExp },
        });
        if (dbDepartment) {
          return res.status(200).send({
            message: `${dbDepartment.department} Department is already exist`,
            success: false,
          });
        } else {
          const newDepartment = new DepartmentModel({
            department,
            departmentImg,
            description,
          });
          await newDepartment.save().then(() => {
            res.status(201).send({
              message: "New department added successfully",
              success: true,
            });
          });
        }
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
      message: `editDepartment controller ${error.message}`,
    });
  }
};

// get all appointments

const getAllAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const appointments = await AppointmentModel.find()
      .populate("client")
      .populate("doctor")
      .sort({ updatedAt: 1 })
      .skip((page - 1) * limit)
    .limit(limit);

    if (!appointments) {
      return res
        .status(200)
        .send({ message: "No Appointments exist ", success: false });
    } else {
      res.status(201).send({ appointments,
        currentPage: page,
        totalPages: Math.ceil((await AppointmentModel.countDocuments()) / limit),
        success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `getAllAppointments controller ${error.message}`,
    });
  }
};

// get admin dashboard details

const getAdminDashboardDetails = async (req, res) => {
  try {
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

    const totalPatients = await ClientModel.find().count();
    const totalDoctors = await DoctorModel.find({
      status: { $nin: ["pending", "rejected"] },
    }).count();
    const totalAppointments = await AppointmentModel.find().count();
    const salesReport = await AppointmentModel.aggregate([
      {
        $match: {
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
      totalPatients,
      totalDoctors,
      totalAppointments,
      salesReport: newSalesReport,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `editDepartment controller ${error.message}`,
    });
  }
};
module.exports = {
  getPendingDoctors,
  acceptDoctorAppointment,
  rejectDoctorAppointment,
  getDoctorsDetails,
  blockDoctor,
  unBlockDoctor,
  getClientDetails,
  blockClient,
  unBlockClient,
  getAllAppointments,
  postDepartments,
  getDepartments,
  deleteDepartment,
  putEditDepartment,
  getAdminDashboardDetails,
};
