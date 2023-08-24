const mongoose = require("mongoose");


const daySchema = new mongoose.Schema({
  day: {
    type: String,
    trim: true,
  },

  status: {
    type: String,
    trim: true,
    default: "active",
  },
  time: [
    {
      start: {
        type: Date,
        trim: true,
      },
      end: {
        type: Date,
        trim: true,
      },
      slots: {
        type: Number,
        trim: true,
      },
    },
  ],
});

const doctorSchema = new mongoose.Schema(
  {
    fName: {
      type: String,
      trim: true,
      required: [true, "fName is required"],
    },
    lName: {
      type: String,
      trim: true,
      required: [true, "lName is required"],
    },
    specialization: {
      type: String,
      trim: true,
      required: [true, "specialization of birth is required"],
    },
    experience: {
      type: String,
      required: [true, "experience is required"],
    },
    location: {
      type: String,
      required: [true, "location is required"],
    },
    number: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password is required"],
    },
    licenceImg: {
      type: String,
    },
    education: {
      type: String,
    },
    address: {
      type: String,
    },
    consultationFees: {
      type: Number,
      trim: true,
    },
    availablity: [daySchema],
    doctorImg: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
