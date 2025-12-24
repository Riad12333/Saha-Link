"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Loader, Zap } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedQuestions = [
  "أشعر بألم في الصدر وضيق في التنفس",
  "لدي حمى مستمرة منذ 3 أيام",
  "أعاني من الصداع المتكرر والدوخة",
  "لدي آلام في المفاصل والعضلات",
]

const medicalResponses: Record<string, string> = {
  "ألم في الصدر": `تنويه هام: ألم الصدر قد يكون إشارة على حالة طبية طارئة.
  
يرجى التوجه فوراً إلى أقرب مستشفى أو اتصل برقم الطوارئ (1020 في الجزائر).

الأعراض التي تتطلب عناية فورية:
- صعوبة في التنفس
- ألم حاد ومستمر
- شعور بالدوخة الشديدة
- ضعف أو خدر في الذراع أو الوجه

يمكنك أيضاً استشارة طبيب متخصص في طب القلب من خلال منصتنا.`,

  حمى: `الحمى قد تكون علامة على عدوى فيروسية أو بكتيرية.

التوصيات الأولية:
- قياس درجة الحرارة بانتظام
- شرب السوائل بكثرة
- الراحة الكافية
- تجنب الأنشطة الشاقة

متى تطلب مساعدة طبية:
- إذا استمرت الحمى أكثر من 3 أيام
- إذا كانت الحمى أعلى من 39°C
- إذا ظهرت أعراض إضافية خطيرة

نوصي بحجز استشارة مع طبيب عام أو متخصص في الأمراض المعدية.`,

  صداع: `الصداع قد يكون ناتجاً عن عدة أسباب مثل الإرهاق أو الضغط النفسي.

الحلول الأولية:
- الراحة في مكان هادئ
- شرب الماء بكثرة
- تجنب الشاشات
- تطبيق كمادة باردة على الرأس

متى تطلب مساعدة:
- صداع مستمر ولم يختفِ بعد أسبوع
- صداع حاد مفاجئ غير معتاد
- مصحوب بحمى أو تيبس في الرقبة

يمكنك استشارة طبيب أعصاب أو طبيب عام.`,

  "آلام المفاصل": `آلام المفاصل قد تكون ناتجة عن إرهاق أو التهاب.

التوصيات:
- الراحة والتقليل من الأنشطة الشاقة
- تطبيق كمادات ساخنة أو باردة
- ممارسة تمارين خفيفة
- الحفاظ على وزن صحي

متى تستشير طبيباً:
- إذا استمرت الآلام أكثر من أسبوعين
- إذا كانت الآلام شديدة وتؤثر على الحركة
- إذا ظهر تورم أو احمرار

نوصي بحجز استشارة مع متخصص في العظام أو الروماتيزم.`,
}

export function MedicalAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "مرحباً! أنا المساعد الطبي الذكي. يمكنك وصف أعراضك وسأساعدك بتقديم توصيات أولية. تذكر، هذا ليس تشخيصاً طبياً رسمياً.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    // Check for keywords
    for (const [keyword, response] of Object.entries(medicalResponses)) {
      if (userMessage.includes(keyword)) {
        return response
      }
    }

    // Generic response
    return `شكراً على المعلومات. بناءً على ما ذكرته:

التوصيات الأولية:
1. راقب الأعراض عن كثب
2. احصل على قسط كافٍ من الراحة
3. شرب السوائل بكثرة
4. تجنب الأنشطة الشاقة

أعراض تتطلب عناية فورية:
- تفاقم مفاجئ للأعراض
- صعوبة في التنفس
- فقدان الوعي
- ألم حاد غير محتمل

نوصي بشدة بحجز استشارة مع طبيب متخصص لتقييم شامل والحصول على تشخيص دقيق.`
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const assistantResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: generateResponse(input),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantResponse])
    setIsLoading(false)
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Chat Messages */}
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
              >
                {message.timestamp.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">جاري المعالجة...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </CardContent>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">أو اختر من الأسئلة المقترحة:</p>
          <div className="space-y-2">
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestedQuestion(question)}
                className="w-full text-left px-3 py-2 text-sm border border-border rounded hover:bg-muted transition flex items-center gap-2"
              >
                <Zap className="w-3 h-3 text-accent" />
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4 space-y-3">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="اكتب أعراضك أو سؤالك الطبي..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          هذا المساعد يقدم استشارات تثقيفية فقط - استشر طبيباً للتشخيص الرسمي
        </p>
      </div>
    </Card>
  )
}
