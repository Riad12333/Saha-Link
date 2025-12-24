const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const api = {
    // Auth endpoints
    register: `${API_URL}/auth/register`,
    login: `${API_URL}/auth/login`,
    getMe: `${API_URL}/auth/me`,
    updatePassword: `${API_URL}/auth/update-password`,

    // Doctor endpoints
    doctors: `${API_URL}/doctors`,
    doctor: (id: string) => `${API_URL}/doctors/${id}`,
    doctorSlots: (id: string) => `${API_URL}/doctors/${id}/slots`,
    doctorReviews: (id: string) => `${API_URL}/doctors/${id}/reviews`,
    doctorDashboard: `${API_URL}/doctors/dashboard`,
    doctorPatients: `${API_URL}/doctors/patients`,
    patientRecord: (id: string) => `${API_URL}/doctors/patients/${id}/medical-record`,

    // Patient endpoints
    patientProfile: `${API_URL}/patients/profile`,
    patientAppointments: `${API_URL}/patients/appointments`,
    patientDashboard: `${API_URL}/patients/dashboard`,
    medicalRecord: `${API_URL}/patients/medical-record`,

    // Appointment endpoints
    appointments: `${API_URL}/appointments`,
    appointment: (id: string) => `${API_URL}/appointments/${id}`,

    // Admin endpoints
    admin: `${API_URL}/admin`,
    adminStats: `${API_URL}/admin/stats`,
    adminUsers: `${API_URL}/admin/users`,
    adminUser: (id: string) => `${API_URL}/admin/users/${id}`,
    adminToggleStatus: (id: string) => `${API_URL}/admin/users/${id}/toggle-status`,
    adminDoctors: `${API_URL}/admin/doctors`,
    adminPendingDoctors: `${API_URL}/admin/doctors/pending`,
    adminApproveDoctor: (id: string) => `${API_URL}/admin/doctors/${id}/approve`,
    adminContacts: `${API_URL}/admin/contacts`,

    // Content endpoints
    blog: `${API_URL}/blog`,
    blogPost: (id: string) => `${API_URL}/blog/${id}`,
    specialties: `${API_URL}/specialties`,
    specialty: (id: string) => `${API_URL}/specialties/${id}`,
    contact: `${API_URL}/contact`,
    stats: `${API_URL}/stats`,

    // Chat endpoints
    messages: (userId: string) => `${API_URL}/messages/${userId}`,
    sendMessage: `${API_URL}/messages`,
    unreadMessages: `${API_URL}/messages/unread`,
    conversations: `${API_URL}/messages/conversations`,
    testimonials: `${API_URL}/testimonials`,
};

export default API_URL;
