"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

export interface DoctorProfile {
  id: string
  email: string
  name: string
  specialty: string
  city: string
  bio: string
  experience: number
  phone: string
  hospital?: string
  consultationFee: number
  consultationFeeOnline: number
  rating: number
  reviews: number
  status: "pending" | "approved" | "rejected"
  languages: string[]
  createdAt: string
}

export interface TimeSlot {
  id: string
  dayOfWeek: number // 0-6
  startTime: string // HH:MM
  endTime: string // HH:MM
  type: "online" | "offline"
  maxPatients: number
}

export interface DoctorAppointment {
  id: string
  doctorId: string
  patientId: string
  patientName: string
  date: string
  time: string
  type: "online" | "offline"
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  report?: string
}

interface DoctorContextType {
  doctorProfile: DoctorProfile | null
  appointments: DoctorAppointment[]
  timeSlots: TimeSlot[]
  isLoading: boolean
  registerDoctor: (data: Partial<DoctorProfile>) => Promise<void>
  updateDoctorProfile: (data: Partial<DoctorProfile>) => Promise<void>
  addTimeSlot: (slot: TimeSlot) => Promise<void>
  removeTimeSlot: (slotId: string) => Promise<void>
  getAppointments: () => Promise<void>
  updateAppointmentStatus: (appointmentId: string, status: string) => Promise<void>
  addAppointmentReport: (appointmentId: string, report: string) => Promise<void>
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined)

const mockDoctor: DoctorProfile = {
  id: "doc1",
  email: "fatima@example.com",
  name: "د. فاطمة أحمد",
  specialty: "طب القلب",
  city: "الجزائر",
  bio: "متخصصة في أمراض القلب والجهاز الدوري مع 10 سنوات من الخبرة",
  experience: 10,
  phone: "+213 123 45 67",
  hospital: "مستشفى الرحمة",
  consultationFee: 2500,
  consultationFeeOnline: 2000,
  rating: 4.9,
  reviews: 156,
  status: "approved",
  languages: ["Arabic", "French", "English"],
  createdAt: new Date().toISOString(),
}

const mockAppointments: DoctorAppointment[] = [
  {
    id: "apt1",
    doctorId: "doc1",
    patientId: "pat1",
    patientName: "محمد علي",
    date: "2025-02-15",
    time: "14:00",
    type: "online",
    status: "confirmed",
    notes: "استشارة متابعة",
  },
  {
    id: "apt2",
    doctorId: "doc1",
    patientId: "pat2",
    patientName: "نور الهدى",
    date: "2025-02-16",
    time: "10:00",
    type: "offline",
    status: "pending",
    notes: "فحص شامل",
  },
]

export function DoctorProvider({ children }: { children: React.ReactNode }) {
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        // Import authService dynamically to avoid circular dependencies
        const authService = (await import("@/lib/auth")).default
        const api = (await import("@/lib/api")).api
        
        const token = authService.getToken()
        if (!token) {
          setIsLoading(false)
          return
        }

        // Fetch current user with doctor profile
        const response = await fetch(api.getMe, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          const userData = await response.json()
          
          // Check if user is a doctor and has a doctor profile
          if (userData.role === 'doctor' && userData.doctorProfile) {
            const doctor = userData.doctorProfile
            
            // Transform API data to DoctorProfile format
            const profile: DoctorProfile = {
              id: doctor._id || doctor.id,
              email: userData.email,
              name: userData.name,
              specialty: doctor.specialty || '',
              city: doctor.city || '',
              bio: doctor.bio || '',
              experience: doctor.experience || 0,
              phone: userData.phone || doctor.phone || '',
              hospital: doctor.clinicAddress || doctor.hospital || '',
              consultationFee: typeof doctor.consultationFees === 'object' 
                ? doctor.consultationFees.inPerson || 0 
                : doctor.consultationFees || 0,
              consultationFeeOnline: typeof doctor.consultationFees === 'object' 
                ? doctor.consultationFees.online || 0 
                : 0,
              rating: doctor.averageRating || 0,
              reviews: doctor.totalReviews || 0,
              status: doctor.isApproved ? 'approved' : 'pending',
              languages: doctor.languages || [],
              createdAt: doctor.createdAt || new Date().toISOString()
            }
            
            setDoctorProfile(profile)
          }
        }
      } catch (error) {
        console.error("Error loading doctor profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDoctorProfile()
  }, [])

  const registerDoctor = useCallback(async (data: Partial<DoctorProfile>) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newDoctor: DoctorProfile = {
        ...mockDoctor,
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "pending",
      }
      setDoctorProfile(newDoctor)
      localStorage.setItem("doctor", JSON.stringify(newDoctor))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateDoctorProfile = useCallback(
    async (data: Partial<DoctorProfile>) => {
      if (!doctorProfile) return
      try {
        const updated = { ...doctorProfile, ...data }
        setDoctorProfile(updated)
        localStorage.setItem("doctor", JSON.stringify(updated))
      } finally {
        setIsLoading(false)
      }
    },
    [doctorProfile],
  )

  const addTimeSlot = useCallback(async (slot: TimeSlot) => {
    setTimeSlots((prev) => [...prev, { ...slot, id: Date.now().toString() }])
  }, [])

  const removeTimeSlot = useCallback(async (slotId: string) => {
    setTimeSlots((prev) => prev.filter((s) => s.id !== slotId))
  }, [])

  const getAppointments = useCallback(async () => {
    setAppointments(mockAppointments)
  }, [])

  const updateAppointmentStatus = useCallback(async (appointmentId: string, status: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: status as DoctorAppointment["status"] } : apt)),
    )
  }, [])

  const addAppointmentReport = useCallback(async (appointmentId: string, report: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, report, status: "completed" } : apt)),
    )
  }, [])

  return (
    <DoctorContext.Provider
      value={{
        doctorProfile,
        appointments,
        timeSlots,
        isLoading,
        registerDoctor,
        updateDoctorProfile,
        addTimeSlot,
        removeTimeSlot,
        getAppointments,
        updateAppointmentStatus,
        addAppointmentReport,
      }}
    >
      {children}
    </DoctorContext.Provider>
  )
}

export function useDoctor() {
  const context = useContext(DoctorContext)
  if (!context) {
    throw new Error("useDoctor must be used within DoctorProvider")
  }
  return context
}
