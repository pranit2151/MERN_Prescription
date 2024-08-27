const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  }
});

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profilePicture: {
    type: String // Consider using a file storage solution for images
  },
  specialty: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  yearsOfExperience: {
    type: Number,
    required: true
  }

});

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profilePicture: {
    type: String // Consider using a file storage solution for images
  },
  age: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  historyOfSurgery: {
    type: String
  },
  historyOfIllness: {
    type: String
  }
});

const consultationSchema = new mongoose.Schema({
  currentIllness: {
    type: String,
    required: true
  },
  recentSurgery: {
    type: String,
    required: true
  },
  isDiabetic: {
    type: String,
    required: true
  },
  allergies: {
    type: String,
    required: true
  },
  others: {
    type: String
  },
  patientId: {
    type: String,
    required: true
  },
  doctorId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const prescriptionSchema = new mongoose.Schema({
    doctorId :{
    type:String,
    require:true
  },
  patientId :{
    type:String,
    require:true
  },
  careToBeTaken :{
    type:String,
    require:true
  },
  medicines :{
    type:String,
    require:false
  },
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
const Consultation = mongoose.model('Consultation', consultationSchema);
const User = mongoose.model('User', userSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);

module.exports = { User, Doctor, Patient,Consultation, Prescription};
