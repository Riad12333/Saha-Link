"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Loader2, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"

interface Message {
    _id: string
    content: string
    sender: {
        _id: string
        name: string
        avatar?: string
    }
    receiver: {
        _id: string
        name: string
    }
    createdAt: string
    read: boolean
}

interface ChatDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    recipientId: string
    recipientName: string
}

export function ChatDialog({ open, onOpenChange, recipientId, recipientName }: ChatDialogProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
        const user = authService.getUser()
        setCurrentUser(user)
    }, [])

    useEffect(() => {
        if (open && recipientId && currentUser) {
            fetchMessages()
        }
    }, [open, recipientId, currentUser])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const token = authService.getToken()
            const response = await fetch(api.messages(recipientId), {
                headers: { Authorization: `Bearer ${token}` }
            })
            const result = await response.json()
            if (result.success) {
                setMessages(result.data)
            }
        } catch (error) {
            console.error("Error fetching messages:", error)
            toast.error("Erreur lors du chargement des messages")
        } finally {
            setLoading(false)
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !currentUser) return

        setSending(true)
        try {
            const token = authService.getToken()
            const response = await fetch(api.sendMessage, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverId: recipientId,
                    content: newMessage
                })
            })

            const result = await response.json()
            if (result.success) {
                setMessages([...messages, result.data])
                setNewMessage("")
            } else {
                toast.error("Erreur lors de l'envoi")
            }
        } catch (error) {
            console.error("Error sending message:", error)
            toast.error("Erreur lors de l'envoi")
        } finally {
            setSending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md h-[600px] flex flex-col p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Discussion avec {recipientName}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="flex-1 p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2 pt-20">
                            <p>Aucun message</p>
                            <p className="text-sm">Envoyez le premier message à {recipientName}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg) => {
                                const isMe = msg.sender._id === currentUser?._id
                                return (
                                    <div
                                        key={msg._id}
                                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`flex gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"
                                                }`}
                                        >
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={msg.sender.avatar} />
                                                <AvatarFallback>
                                                    {msg.sender.name ? msg.sender.name.substring(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div
                                                className={`rounded-lg p-3 text-sm ${isMe
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted text-foreground"
                                                    }`}
                                            >
                                                <p>{msg.content}</p>
                                                <span className={`text-[10px] block mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={scrollRef} />
                        </div>
                    )}
                </ScrollArea>

                <div className="p-4 border-t">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Écrivez votre message..."
                            disabled={sending}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={sending || !newMessage.trim()}>
                            {sending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
