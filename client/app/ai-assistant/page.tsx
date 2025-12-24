"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MedicalChatbot } from "@/components/MedicalChatbot"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Info } from "lucide-react"
import { useLanguage } from "@/providers/language-provider"

export default function AIAssistantPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">{t("ai.hero_title")}</h1>
              <p className="text-lg text-muted-foreground">
                {t("ai.hero_subtitle")}
              </p>
            </div>

            {/* Disclaimer */}
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardContent className="pt-6 flex gap-4">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900">
                  <p className="font-semibold mb-1">{t("ai.disclaimer_title")}</p>
                  <p>
                    {t("ai.disclaimer_desc")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <MedicalChatbot />

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <Info className="w-5 h-5 text-primary" />
                  <p className="font-semibold text-sm">{t("ai.step1_title")}</p>
                  <p className="text-xs text-muted-foreground">{t("ai.step1_desc")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <Info className="w-5 h-5 text-primary" />
                  <p className="font-semibold text-sm">{t("ai.step2_title")}</p>
                  <p className="text-xs text-muted-foreground">{t("ai.step2_desc")}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <Info className="w-5 h-5 text-primary" />
                  <p className="font-semibold text-sm">{t("ai.step3_title")}</p>
                  <p className="text-xs text-muted-foreground">{t("ai.step3_desc")}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

