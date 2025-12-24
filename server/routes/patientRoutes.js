const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    getAppointments,
    getMedicalRecord,
    updateMedicalRecord
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and patient-only
router.use(protect);
router.use(authorize('patient'));

router.route('/profile')
    .get(getProfile)
    .put(updateProfile);

router.get('/appointments', getAppointments);

router.route('/medical-record')
    .get(getMedicalRecord)
    .put(updateMedicalRecord);

router.get('/dashboard', require('../controllers/patientController').getDashboard);

module.exports = router;
