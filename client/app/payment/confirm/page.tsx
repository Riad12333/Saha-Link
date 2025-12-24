"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Download, Calendar } from "lucide-react"
import Link from "next/link"

export default function PaymentConfirmPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container px-4 md:px-6">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="pt-12 pb-12 text-center space-y-8">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">تم تأكيد حجزك بنجاح!</h1>
                <p className="text-lg text-muted-foreground">سيتلقى طبيبك طلب الحجز قريباً وسيؤكده</p>
              </div>

              {/* Booking Details */}
              <Card className="bg-muted">
                <CardContent className="pt-6 text-right space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">رقم الحجز:</span>
                    <span className="font-bold">#APT-2025-001234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">الطبيب:</span>
                    <span className="font-bold">د. فاطمة أحمد</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">التخصص:</span>
                    <span className="font-bold">طب القلب</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-muted-foreground">الموعد:</span>
                    <span className="font-bold">15 فبراير 2025 - 10:00 صباحاً</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">النوع:</span>
                    <span className="font-bold">استشارة عبر الإنترنت</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">الرسم:</span>
                    <span className="font-bold text-primary">2000 دج</span>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <div className="bg-blue-50 p-4 rounded-lg text-left space-y-2">
                <p className="font-semibold text-blue-900">الخطوات التالية:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>ستتلقى رسالة بريد إلكتروني مع تفاصيل الحجز</li>
                  <li>الطبيب سيؤكد الحجز خلال 24 ساعة</li>
                  <li>ستحصل على رابط الاستشارة قبل الموعد بـ 15 دقيقة</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/patient/appointments" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Calendar className="w-4 h-4 ml-2" />
                    عرض المواعيد
                  </Button>
                </Link>
                <Button className="flex-1">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل الإيصال
                </Button>
              </div>

              <Link href="/" className="text-primary hover:underline">
                العودة للرئيسية
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
