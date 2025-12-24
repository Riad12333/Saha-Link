const express = require('express');
const router = express.Router();
const {
    getDoctors,
    getDoctor,
    getDoctorSlots,
    getDoctorReviews,
    createDoctor,
    updateDoctor,
    addReview,
    getPatientMedicalRecord
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

// Doctor dashboard and patients - MUST BE BEFORE /:id
router.get('/dashboard', protect, authorize('doctor'), require('../controllers/doctorController').getDashboard);
router.get('/patients', protect, authorize('doctor'), require('../controllers/doctorController').getPatients);

// Doctor accessing patient record - uses a specific path that doesn't conflict easily, but safer here or ensure exact matching
router.get('/patients/:patientId/medical-record', protect, authorize('doctor'), getPatientMedicalRecord);

router.route('/')
    .get(getDoctors)
    .post(protect, authorize('doctor'), createDoctor);

router.get('/:id/slots', getDoctorSlots);
router.get('/:id/reviews', getDoctorReviews);
router.post('/:id/reviews', protect, authorize('patient'), addReview);

router.route('/:id')
    .get(getDoctor)
    .put(protect, authorize('doctor', 'admin'), updateDoctor);

module.exports = router;
