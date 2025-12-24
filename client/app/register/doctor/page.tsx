"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDoctor } from "@/providers/doctor-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const specialties = ["طب القلب", "الأعصاب", "الجلدية", "الأطفال", "الجراحة", "طب الأسنان", "أمراض النساء", "العيون"]

export default function DoctorRegisterPage() {
  const router = useRouter()
  const { registerDoctor, isLoading } = useDoctor()
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    city: "",
    experience: "",
    hospital: "",
    bio: "",
    consultationFee: "",
    consultationFeeOnline: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError("يرجى ملء جميع الحقول المطلوبة")
        return false
      }
    } else if (step === 2) {
      if (!formData.specialty || !formData.city || !formData.experience) {
        setError("يرجى ملء جميع الحقول المطلوبة")
        return false
      }
    } else if (step === 3) {
      if (!formData.consultationFee || !formData.consultationFeeOnline) {
        setError("يرجى ملء جميع الحقول المطلوبة")
        return false
      }
    }
    setError("")
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return

    try {
      await registerDoctor({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialty: formData.specialty,
        city: formData.city,
        experience: Number.parseInt(formData.experience),
        hospital: formData.hospital,
        bio: formData.bio,
        consultationFee: Number.parseFloat(formData.consultationFee),
        consultationFeeOnline: Number.parseFloat(formData.consultationFeeOnline),
      })
      router.push("/doctor/dashboard")
    } catch (err) {
      setError("فشل تسجيل الطبيب. يرجى المحاولة مرة أخرى")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">تسجيل الأطباء</CardTitle>
          <CardDescription>
            خطوة {step} من 3 -{" "}
            {step === 1 ? "المعلومات الأساسية" : step === 2 ? "المعلومات الطبية" : "معلومات الاستشارة"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">الاسم الكامل</label>
                  <Input name="name" placeholder="د. أحمد محمد" value={formData.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="doctor@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">كلمة المرور</label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Medical Info */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">التخصص</label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">اختر التخصص</option>
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">المدينة</label>
                  <Input name="city" placeholder="الجزائر" value={formData.city} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">سنوات الخبرة</label>
                  <Input
                    type="number"
                    name="experience"
                    placeholder="10"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">المستشفى / العيادة (اختياري)</label>
                  <Input
                    name="hospital"
                    placeholder="مستشفى الرحمة"
                    value={formData.hospital}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Consultation Fees */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">رسوم الاستشارة في العيادة (دج)</label>
                  <Input
                    type="number"
                    name="consultationFee"
                    placeholder="2500"
                    value={formData.consultationFee}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">رسوم الاستشارة عبر الإنترنت (دج)</label>
                  <Input
                    type="number"
                    name="consultationFeeOnline"
                    placeholder="2000"
                    value={formData.consultationFeeOnline}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">السيرة الذاتية / عن نفسك</label>
                  <textarea
                    name="bio"
                    placeholder="اكتب عن خبرتك والخدمات التي تقدمها"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background min-h-24"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-6">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  السابق
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={handleNext} className="flex-1">
                  التالي
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "جاري التسجيل..." : "إتمام التسجيل"}
                </Button>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground pt-4">
              هل لديك حساب بالفعل؟{" "}
              <Link href="/doctor/login" className="text-primary hover:underline font-semibold">
                دخول
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
