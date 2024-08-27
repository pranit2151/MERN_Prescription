const express = require('express');
const router = express.Router();
const { User, Doctor, Patient, Consultation, Prescription } = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const requireAuth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const uploadPath = path.join(__dirname, '../uploads'); // Adjust path as needed
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Doctor signup with image upload
router.post('/doctor/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, email, password, specialty, phoneNumber, yearsOfExperience, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    const user = new User({ name, email, userType, password: hashedPassword });
    const savedUser = await user.save();

    const doctor = new Doctor({
      user: savedUser._id,
      specialty,
      phoneNumber,
      yearsOfExperience,
      profilePicture: req.file ? req.file.path : null // Set profilePicture if uploaded
    });

    await doctor.save();

    // Generate JWT token
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Doctor registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Patient signup with image upload
router.post('/patient/signup', upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, email, password, age, phoneNumber, historyOfSurgery, userType, historyOfIllness } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password

    const user = new User({ name, email, userType, password: hashedPassword });
    const savedUser = await user.save();

    const patient = new Patient({
      user: savedUser._id,
      age,
      phoneNumber,
      historyOfSurgery,
      historyOfIllness,
      profilePicture: req.file ? req.file.path : null // Set profilePicture if uploaded
    });

    await patient.save();

    // Generate JWT token
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Patient registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('doctor').populate('patient');

    console.log("user-------", user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { ...user._doc, userType: user.userType, role: user.userType } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected route example
router.get('/protected', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('doctor').populate('patient');
    res.json({ message: 'This is a protected route', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user'); // Fetch all doctors with populated user data
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new consultation
router.post('/consultations', async (req, res) => {
  try {
    console.log("in post consultations router >>> ")
    const { currentIllness, recentSurgery, isDiabetic, allergies, others, patientId, doctorId } = req.body;

    console.log("body&&&&&", req.body)
    const consultation = new Consultation({
      currentIllness,
      recentSurgery,
      isDiabetic,
      allergies,
      others,
      patientId: patientId,
      doctorId: doctorId
    });

    const savedConsultation = await consultation.save();
    res.status(201).json(savedConsultation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating consultation' });
  }
});

// Fetch all consultations
router.get('/consultations', async (req, res) => {
  try {
    const consultations = await Consultation.find();
    res.status(200).json(consultations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching consultations' });
  }
});

// Fetch consultations by patientId
router.get('/consultations/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const consultations = await Consultation.find({ patientId });
    if (consultations.length === 0) {
      return res.status(404).json({ message: 'No consultations found for this patient' });
    }
    res.status(200).json(consultations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching consultations' });
  }
});

// Fetch consultations by doctorId
router.get('/consultations/doctor/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const consultations = await Consultation.find({ doctorId });
    if (consultations.length === 0) {
      return res.status(404).json({ message: 'No consultations found for this doctor' });
    }
    res.status(200).json(consultations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching consultations' });
  }
});

router.post('/prescription', async (req, res) => {
  try {
    // Correcting req.body to req.body (removing the parentheses)
    const { doctorId,patientId, careToBeTaken, medicines } = req.body;

    // Create a new Prescription instance
    const prescription = new Prescription({
      doctorId,
      patientId,
      careToBeTaken,
      medicines
    });

    // Save the prescription to the database
    const savedPrescription = await prescription.save();

    // Use res.status to set the status code and send the JSON response
    res.status(201).json(savedPrescription);

  } catch (error) {
    // Use res.status to set the status code and send the error response
    res.status(500).json({ error: 'Error creating Prescription' });
  }
});

// Fetch prescreptions by patientId
router.post('/prescriptionByPatientId', async (req, res) => {
  try {
    const { patientId } = req.body;
    console.log("patientId>>>",patientId)
    const prescriptionsAll = await Prescription.find();
    console.log("prescriptionsAll>>>",prescriptionsAll)
    const prescriptions = await Prescription.find({ patientId });
    if (prescriptions.length === 0) {
      return res.status(404).json({ message: 'No consultations found for this doctor' });
    }
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching consultations' });
  }
});


module.exports = router;
