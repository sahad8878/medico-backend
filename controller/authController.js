const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const validator = require("validator");

const ClientModel = require("../model/clientModel");

const DoctorModel = require("../model/doctorModel");

const DepartmentModel = require("../model/departmentModel");

// client signup
const signupController = async (req, res) => {
  try {
    const {
      fName,
      lName,
      dateOfBirth,
      age,
      sex,
      email,
      password,
      number,
      address,
      confirmPassword,
    } = req.body;
    if (
      fName &&
      lName &&
      dateOfBirth &&
      age &&
      sex &&
      email &&
      password &&
      number &&
      address&&
      confirmPassword
    ) {
      // validation
      if (!validator.isEmail(email)) {
        return res
          .status(200)
          .send({ message: "Email is not valid", success: false });
      }
      if (!validator.isStrongPassword(password)) {
        return res
          .status(200)
          .send({ message: "Password not strong enough", success: false });
      }
      if (!validator.isMobilePhone(number, "en-IN")) {
        return res
          .status(200)
          .send({ message: "Phone Number is not valid", success: false });
      }
      const existingClient = await ClientModel.findOne({ email: email });
      if (existingClient) {
        return res
          .status(200)
          .send({ message: "Client Already Exist", success: false });
      }
      if (password != confirmPassword) {
        return res
          .status(200)
          .send({ message: "password not same", success: false });
      }
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password.trim(), salt);
      const newClient = new ClientModel({
        fName,
        lName,
        dateOfBirth,
        age,
        sex,
        email,
        number,
        address, 
        password: hashedPassword,
      });
      await newClient.save();
      res.status(201).send({ message: "signup successfully", success: true });
    } else {
      return res
        .status(200)
        .send({ message: "All fields must be filled", success: false });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: `Signup controller ${error.message}` });
  }
};

// Client Login

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const client = await ClientModel.findOne({ email });
      if (!client) {
        return res
          .status(200)
          .send({ message: "User not found", success: false });
      }
      if (client.block === true) {
        return res
          .status(200)
          .send({ message: "You have been blocked", success: false });
      }
     
      const isMatch = await bcrypt.compare(password, client.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "Invalid Email or Password", success: false });
      }
      const clientToken = jwt.sign({ id: client._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 ,
      });
      const clientName = client.fName;
      const clientId = client._id;
      res.status(200).send({
        message: "Login success",
        success: true,
        clientName,
        clientId,
        clientToken,
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
      message: `Error in LOGIN controller ${error.message}`,
    });
  }
};

// Admin login

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const admin = await ClientModel.findOne({ email, isAdmin: true });
      console.log(admin);
      if (!admin) {
        return res
          .status(200)
          .send({ message: "Admin not found", success: false });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "Invalid Email or Password", success: false });
      }
      const adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 ,
      });
      const AdminEmail = admin.email;
      res.status(200).send({
        message: "Login success",
        success: true,
        AdminEmail,
        adminToken,
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
      message: `Error in ADMIN LOGIN controller ${error.message}`,
    });
  }
};

// Doctor Signup

const doctorSignup = async (req, res) => {
  try {
    const {
      fName,
      lName,
      specialization,
      experience,
      location,
      licenceImg,
      email,
      password,
      number,
      confirmPassword,
    } = req.body;
    if (
      fName &&
      lName &&
      specialization &&
      experience &&
      licenceImg &&
      location &&
      email &&
      password &&
      number &&
      confirmPassword
    ) {
      // validation
      if (!validator.isEmail(email)) {
        return res
          .status(200)
          .send({ message: "Email is not valid", success: false });
      }
      if (!validator.isStrongPassword(password)) {
        return res
          .status(200)
          .send({ message: "Password not strong enough", success: false });
      }
      if (!validator.isMobilePhone(number, "en-IN")) {
        return res
          .status(200)
          .send({ message: "Phone Number is not Valid", success: false });
      }

      const existingDoctor = await DoctorModel.findOne({ email: email });
      if (existingDoctor) {
        if (existingDoctor.status === "rejected") {
          return res
            .status(200)
            .send({ message: "This account already rejected", success: false });
        }
        return res
          .status(200)
          .send({ message: "Doctor Already Exist", success: false });
      }
      if (password != confirmPassword) {
        return res
          .status(200)
          .send({ message: "password not same", success: false });
      }
      const salt = await bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password.trim(), salt);
      const newDoctor = new DoctorModel({
        fName,
        lName,
        specialization,
        experience,
        location,
        licenceImg,
        email,
        number,
        status: "pending",
        password: hashedPassword,
      });
      await newDoctor.save().then(async (doctor) => {
        const doctorToken = jwt.sign(
          { id: doctor._id },
          process.env.JWT_SECRET,
          {
            expiresIn: 60 * 60 * 24 ,
          }
        );
        const doctorId = doctor._id;
        const doctorName = doctor.fName;
        res
          .status(201)
          .send({
            doctorId,
            doctorName,
            doctorToken,
            message: "signup successfully",
            success: true,
          });
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
      message: `Error in Doctor Signup controller ${error.message}`,
    });
  }
};

// Doctor Login

const doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const doctor = await DoctorModel.findOne({ email });
      if (!doctor) {
        return res
          .status(200)
          .send({ message: "Doctor not found", success: false });
      } else {
        if (doctor.block === true) {
          return res
            .status(200)
            .send({ message: "Your have been blocked", success: false });
           
        } else {
          if (doctor.status === "rejected") {
            return res
              .status(200)
              .send({ message: "This account already rejected", success: false });
          }else{


        

          const isMatch = await bcrypt.compare(password, doctor.password);
          if (!isMatch) {
            return res
              .status(200)
              .send({ message: "Invalid Email or Password", success: false });
          } else {
            const doctorToken = jwt.sign(
              { id: doctor._id },
              process.env.JWT_SECRET,
              {
                expiresIn: 60 * 60 * 24 ,
              }
            );
            const doctorId = doctor._id;
            const doctorStatus = doctor.status;
            res.status(200).send({
              message: "Login success",
              success: true,
              doctorId,
              doctorStatus,
              doctorToken,
            });
          }
        }
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
      message: `Error in Doctor Login controller ${error.message}`,
    });
  }
};

module.exports = {
  loginController,
  signupController,
  adminLogin,
  doctorSignup,
  doctorLogin,
};
