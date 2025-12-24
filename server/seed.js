const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Specialty = require('./models/Specialty');
const BlogPost = require('./models/BlogPost');
const Appointment = require('./models/Appointment');
const Review = require('./models/Review');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const specialties = [
    { name: 'Cardiologie', icon: '❤️', color: '#e74c3c' },
    { name: 'Dermatologie', icon: '🩺', color: '#3498db' },
    { name: 'Pédiatrie', icon: '👶', color: '#9b59b6' },
    { name: 'Neurologie', icon: '🧠', color: '#1abc9c' },
    { name: 'Ophtalmologie', icon: '👁️', color: '#f39c12' },
    { name: 'Orthopédie', icon: '🦴', color: '#34495e' },
    { name: 'Psychiatrie', icon: '🧘', color: '#16a085' },
    { name: 'Dentisterie', icon: '🦷', color: '#27ae60' },
    { name: 'Gynécologie', icon: '👩', color: '#e91e63' },
    { name: 'Médecine Générale', icon: '⚕️', color: '#0066cc' }
];

const cities = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Sétif', 'Batna', 'Djelfa', 'Tlemcen', 'Sidi Bel Abbès'];

const firstNames = [
    'Amine', 'Sofiane', 'Meriem', 'Amina', 'Mourad', 'Yacine', 'Sarah', 'Leila', 'Myriam', 'Omar',
    'Farida', 'Anis', 'Ryad', 'Karima', 'Nadia', 'Hichem', 'Nawel', 'Samy', 'Zaki', 'Ines'
];

const lastNames = [
    'Bensalem', 'Cherif', 'Idrisi', 'Benali', 'Mansouri', 'Hassan', 'Omar', 'Ali', 'Mohamed', 'Zahra',
    'Hamidi', 'Kacemi', 'Bouaziz', 'Saidi', 'Belkacem', 'Rahmani', 'Lamine', 'Ferhani', 'Sadek', 'Amari'
];

const avatarImages = [
    'male-doctor-neurologist.jpg',
    'female-doctor-cardiologist.jpg',
    'female-doctor-dermatologist.jpg',
    'female-doctor-pediatrician.jpg',
    'placeholder-user.jpg'
];

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
};

const seedDB = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Doctor.deleteMany({});
        await Specialty.deleteMany({});
        await BlogPost.deleteMany({});
        await Appointment.deleteMany({});
        await Review.deleteMany({});

        // Create specialties
        console.log('📋 Creating specialties...');
        const createdSpecialties = await Specialty.insertMany(specialties);
        console.log(`✅ Created ${specialties.length} specialties`);

        // Create admin user
        console.log('👤 Creating admin user...');
        const admin = await User.create({
            name: 'Admin Medecine App',
            email: 'admin@medecine-app.com',
            password: 'admin123',
            role: 'admin',
            isVerified: true
        });

        // Create 1 patient
        console.log('👥 Creating one sample patient...');
        const patient = await User.create({
            name: 'Patient Test',
            email: 'patient@example.com',
            password: 'patient123',
            role: 'patient',
            phone: '+213555000001',
            isVerified: true
        });

        // Create doctors, blog posts, and appointments
        console.log('👨‍⚕️ Creating doctors, blog posts and fake stats...');
        let doctorCount = 0;
        let appointmentCount = 0;

        for (let i = 0; i < createdSpecialties.length; i++) {
            const spec = createdSpecialties[i];

            for (let j = 0; j < 2; j++) {
                const nameIndex = (i * 2 + j) % firstNames.length;
                const lastNameIndex = (i * 2 + j) % lastNames.length;
                const firstName = firstNames[nameIndex];
                const lastName = lastNames[lastNameIndex];
                const fullName = `Dr. ${firstName} ${lastName}`;
                const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}${j}@example.com`;
                const city = cities[(i * 2 + j) % cities.length];

                const avatarIndex = doctorCount % avatarImages.length;
                const avatarPath = `/${avatarImages[avatarIndex]}`;

                // Create user account
                const user = await User.create({
                    name: fullName,
                    email: email,
                    password: 'doctor123',
                    role: 'doctor',
                    phone: `+213${555000000 + doctorCount}`,
                    avatar: avatarPath,
                    isVerified: true
                });

                // Create doctor profile
                const doctorProfile = await Doctor.create({
                    user: user._id,
                    specialty: spec.name,
                    city: city,
                    experience: 5 + Math.floor(Math.random() * 20),
                    bio: `Spécialiste en ${spec.name} à ${city}.`,
                    clinicAddress: `Clinique ${lastName}, Rue des Martyrs, ${city}`,
                    languages: ['Français', 'Arabe'],
                    consultationFees: {
                        online: 2000,
                        inPerson: 3000
                    },
                    isApproved: true,
                    averageRating: 4.5,
                    totalReviews: 25,
                    availability: [
                        {
                            day: 'monday',
                            slots: [{ start: '09:00', end: '10:00', maxPatients: 1 }]
                        }
                    ]
                });

                doctorCount++;

                // Create blog post
                await BlogPost.create({
                    title: `Conseils de ${spec.name} : Santé ${doctorCount}`,
                    slug: generateSlug(`conseils-${spec.name}-${doctorCount}`),
                    content: `Contenu de l'article sur la ${spec.name}...`,
                    excerpt: `Résumé de l'article sur la ${spec.name}.`,
                    category: 'Maladies',
                    author: user._id,
                    isPublished: true,
                    image: avatarPath
                });

                // Create COMPLETED appointments
                for (let k = 0; k < 5; k++) {
                    await Appointment.create({
                        doctor: doctorProfile._id,
                        patient: patient._id,
                        date: new Date(Date.now() - (k + 1) * 24 * 60 * 60 * 1000),
                        slot: { start: '10:00', end: '11:00' },
                        status: 'completed',
                        type: 'in-person',
                        price: 3000,
                        paymentStatus: 'paid',
                        reason: 'Consultation de suivi'
                    });
                    appointmentCount++;
                }
            }

            spec.doctorCount = 2;
            await spec.save();
        }

        console.log(`✅ Created ${doctorCount} doctors, ${appointmentCount} appointments`);
        console.log('🎉 Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
