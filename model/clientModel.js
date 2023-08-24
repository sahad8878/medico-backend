const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  fName: {
    type: String,
    trim: true,
    required: [true, 'fName is required'],
  },
  lName: {
    type: String,
    trim: true,
    required: [true, 'lName is required'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
  },
  age: {
    type: String,
    trim: true,
    required: [true, 'age is required'],
  },
  sex: {
    type: String,
    required: [true, 'sex is required'],
  },
  number: {
    type: String,
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'email is required'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  address: {
    type: String,
    required: [true, 'address is required'],
  },
  clientImage: {
    type: String,
  },
  
  wallet: {
    type: Number,
    default:0
  },
  notifications:{
    type:Array,
    default:[]
  },
  seenNotifications:{
    type:Array,
    default:[]
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  block:{
    type:Boolean,
    default:false,
  }
}, {
  timestamps: true,
});

const clientModel = mongoose.model('clients', clientSchema);
module.exports = clientModel;
