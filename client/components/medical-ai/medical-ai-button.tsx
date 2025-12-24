"use client"

import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import Link from "next/link"

export function MedicalAIButton() {
  return (
    <Link href="/ai-assistant">
      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <Brain className="w-4 h-4" />
        المساعد الذكي
      </Button>
    </Link>
  )
}
