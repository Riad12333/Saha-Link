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
  const [avatarPreview, setAvatarPreview] = useState("")
  const [avatarBase64, setAvatarBase64] = useState("")
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError("حجم الصورة يجب ألا يتجاوز 2 ميجابايت")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("يرجى تحديد ملف صورة صالح")
      return
    }

    setError("")
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setAvatarPreview(base64String)
      setAvatarBase64(base64String)
    }
    reader.readAsDataURL(file)
  }

  const clearAvatar = () => {
    setAvatarPreview("")
    setAvatarBase64("")
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
        avatar: avatarBase64
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
                {/* Photo de profil */}
                <div className="flex flex-col items-center justify-center gap-2 mb-4">
                  <label className="text-sm font-medium text-slate-700">الصورة الشخصية</label>
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Aperçu" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-400 text-xs text-center px-2">اضغط لإضافة صورة</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearAvatar}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 text-xs"
                    >
                      حذف
                    </Button>
                  )}
                </div>
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
