"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Bot, User, RotateCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
    role: "user" | "assistant"
    content: string
}

export function MedicalChatbot() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Bonjour ! Je suis l'assistant IA de SahaLink. Comment puis-je vous aider aujourd'hui ? Je peux répondre à vos questions sur votre santé, vos symptômes ou expliquer des termes médicaux."
        }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg: Message = { role: "user", content: input }
        setMessages(prev => [...prev, userMsg])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMsg] })
            })

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error)
            }

            setMessages(prev => [...prev, { role: "assistant", content: data.content }])
        } catch (error) {
            console.error("Chat error:", error)
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Désolé, une erreur est survenue lors de la communication avec l'IA. Veuillez vérifier votre connexion ou réessayer plus tard."
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const resetChat = () => {
        setMessages([{
            role: "assistant",
            content: "Bonjour ! Je suis l'assistant IA de SahaLink. Comment puis-je vous aider aujourd'hui ?"
        }])
    }

    return (
        <Card className="w-full max-w-2xl mx-auto flex flex-col h-[600px] shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-xl">
            <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Assistant SahaLink</CardTitle>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-primary border-primary/20">IA Médicale Spécialisée</Badge>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={resetChat} title="Réinitialiser">
                    <RotateCcw className="w-4 h-4 text-muted-foreground" />
                </Button>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "user" ? "bg-primary text-white" : "bg-muted"
                                }`}>
                                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                    ? "bg-primary text-white rounded-tr-none"
                                    : "bg-white border rounded-tl-none text-slate-700"
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center animate-pulse">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                            <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                <span className="text-xs text-muted-foreground">L'IA réfléchit...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CardFooter className="p-4 border-t bg-slate-50/50">
                <div className="flex w-full gap-2 group">
                    <Input
                        placeholder="Décrivez vos symptômes ou posez une question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        className="rounded-xl border-slate-200 focus-visible:ring-primary h-12 bg-white"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </CardFooter>

            <div className="bg-amber-50 px-4 py-2 flex items-center gap-2 border-t border-amber-100">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <p className="text-[10px] text-amber-700 leading-tight">
                    Cet assistant fournit des informations éducatives. En cas d'urgence, contactez le 1020 immédiatement.
                </p>
            </div>
        </Card>
    )
}
