const express = require('express');
const router = express.Router();
const {
    getStats,
    getAllUsers,
    createUser,
    updateUser,
    toggleUserStatus,
    getAllDoctors,
    getPendingDoctors,
    approveDoctor,
    deleteUser,
    getContactForms,
    getSettings,
    updateSettings
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

// Dashboard Stats
router.get('/stats', getStats);

// User Management
router.route('/users')
    .get(getAllUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

router.put('/users/:id/toggle-status', toggleUserStatus);

// Doctor Management
router.get('/doctors', getAllDoctors);
router.get('/doctors/pending', getPendingDoctors);
router.put('/doctors/:id/approve', approveDoctor);

// Content Management
router.get('/contacts', getContactForms);

// System Settings
router.route('/settings')
    .get(getSettings)
    .put(updateSettings);

module.exports = router;
