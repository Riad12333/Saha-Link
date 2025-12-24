"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, User, MessageSquare } from "lucide-react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

interface ChatUser {
    _id: string
    name: string
    avatar?: string
    lastMessage?: string
    lastMessageTime?: string
    unreadCount?: number
}

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

export default function PatientMessagesPage() {
    const [conversations, setConversations] = useState<ChatUser[]>([])
    const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
        const user = authService.getUser()
        setCurrentUser(user)
        fetchConversations()
    }, [])

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser._id)
            const interval = setInterval(() => fetchMessages(selectedUser._id), 5000)
            return () => clearInterval(interval)
        }
    }, [selectedUser])

    const fetchConversations = async () => {
        try {
            const token = authService.getToken()
            const response = await fetch(api.conversations, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const result = await response.json()
            if (result.success) {
                setConversations(result.data)
            }
        } catch (error) {
            console.error("Error fetching conversations:", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchMessages = async (userId: string) => {
        try {
            const token = authService.getToken()
            const response = await fetch(api.messages(userId), {
                headers: { Authorization: `Bearer ${token}` }
            })
            const result = await response.json()
            if (result.success) {
                setMessages(result.data)
            }
        } catch (error) {
            console.error("Error fetching messages:", error)
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !selectedUser) return

        try {
            const token = authService.getToken()
            const response = await fetch(api.sendMessage, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverId: selectedUser._id,
                    content: newMessage
                })
            })

            const result = await response.json()
            if (result.success) {
                setMessages([...messages, result.data])
                setNewMessage("")
            }
        } catch (error) {
            toast.error("Erreur lors de l'envoi")
        }
    }

    return (
        <div className="h-[calc(100vh-2rem)] flex gap-4 p-4">
            {/* Sidebar - Conversations List */}
            <Card className="w-1/3 flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher un médecin..." className="pl-8" />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>Aucune conversation</p>
                                <p className="text-xs mt-2">Démarrez une discussion depuis vos rendez-vous confirmés</p>
                            </div>
                        ) : (
                            conversations.map((chat) => (
                                <button
                                    key={chat._id}
                                    onClick={() => setSelectedUser(chat)}
                                    className={`flex items-center gap-3 p-4 hover:bg-muted transition-colors text-left border-b ${selectedUser?._id === chat._id ? "bg-muted" : ""
                                        }`}
                                >
                                    <Avatar>
                                        <AvatarImage src={chat.avatar} />
                                        <AvatarFallback>{chat.name ? chat.name.substring(0, 2).toUpperCase() : 'DR'}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-semibold truncate">Dr. {chat.name}</span>
                                            {chat.lastMessageTime && (
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(chat.lastMessageTime), { addSuffix: true, locale: fr })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                                    </div>
                                    {chat.unreadCount ? (
                                        <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {chat.unreadCount}
                                        </span>
                                    ) : null}
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </Card>

            {/* Main Chat Area */}
            <Card className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={selectedUser.avatar} />
                                <AvatarFallback>{selectedUser.name ? selectedUser.name.substring(0, 2).toUpperCase() : 'DR'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">Dr. {selectedUser.name}</h3>
                                <span className="text-xs text-green-500 flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    En ligne
                                </span>
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((msg) => {
                                    const isMe = msg.sender._id === currentUser?._id
                                    return (
                                        <div
                                            key={msg._id}
                                            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-lg p-3 ${isMe
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted"
                                                    }`}
                                            >
                                                <p>{msg.content}</p>
                                                <span className={`text-[10px] block mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Écrivez votre message..."
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
