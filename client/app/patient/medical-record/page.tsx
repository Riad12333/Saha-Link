"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

export default function MedicalRecordPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [record, setRecord] = useState<any>({
        bloodType: "",
        height: "",
        weight: "",
        allergies: [],
        chronicDiseases: [],
        currentMedications: [],
        emergencyContact: { name: "", phone: "", relation: "" }
    })

    // Temporary state for new entries
    const [newAllergy, setNewAllergy] = useState("")
    const [newDisease, setNewDisease] = useState("")
    const [newMedication, setNewMedication] = useState("")

    useEffect(() => {
        fetchRecord()
    }, [])

    const fetchRecord = async () => {
        try {
            const token = authService.getToken()
            const response = await fetch(api.medicalRecord, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success && data.data) {
                setRecord(data.data)
            }
        } catch (error) {
            console.error("Error fetching record:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const token = authService.getToken()
            const response = await fetch(api.medicalRecord, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(record)
            })
            const data = await response.json()
            if (data.success) {
                toast.success("Dossier médical mis à jour")
            } else {
                toast.error("Erreur lors de la mise à jour")
            }
        } catch (error) {
            toast.error("Erreur serveur")
        } finally {
            setSaving(false)
        }
    }

    const addToList = (listName: string, value: string, setter: any) => {
        if (!value.trim()) return
        setRecord((prev: any) => ({
            ...prev,
            [listName]: [...(prev[listName] || []), value]
        }))
        setter("")
    }

    const removeFromList = (listName: string, index: number) => {
        setRecord((prev: any) => ({
            ...prev,
            [listName]: prev[listName].filter((_: any, i: number) => i !== index)
        }))
    }

    if (loading) return <div className="p-8">Chargement du dossier...</div>

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Mon Dossier Médical</h1>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations Générales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Groupe Sanguin</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={record.bloodType || ""}
                                onChange={e => setRecord({ ...record, bloodType: e.target.value })}
                            >
                                <option value="">Sélectionner</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Taille (cm)</Label>
                                <Input
                                    type="number"
                                    value={record.height || ""}
                                    onChange={e => setRecord({ ...record, height: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Poids (kg)</Label>
                                <Input
                                    type="number"
                                    value={record.weight || ""}
                                    onChange={e => setRecord({ ...record, weight: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact d'Urgence</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Nom complet</Label>
                            <Input
                                value={record.emergencyContact?.name || ""}
                                onChange={e => setRecord({
                                    ...record,
                                    emergencyContact: { ...record.emergencyContact, name: e.target.value }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <Input
                                value={record.emergencyContact?.phone || ""}
                                onChange={e => setRecord({
                                    ...record,
                                    emergencyContact: { ...record.emergencyContact, phone: e.target.value }
                                })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Relation</Label>
                            <Input
                                value={record.emergencyContact?.relation || ""}
                                onChange={e => setRecord({
                                    ...record,
                                    emergencyContact: { ...record.emergencyContact, relation: e.target.value }
                                })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Allergies */}
                <Card>
                    <CardHeader>
                        <CardTitle>Allergies</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ajouter une allergie..."
                                value={newAllergy}
                                onChange={e => setNewAllergy(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && addToList('allergies', newAllergy, setNewAllergy)}
                            />
                            <Button size="icon" onClick={() => addToList('allergies', newAllergy, setNewAllergy)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {record.allergies?.map((item: string, index: number) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                    <span>{item}</span>
                                    <Button variant="ghost" size="sm" onClick={() => removeFromList('allergies', index)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Chronic Diseases */}
                <Card>
                    <CardHeader>
                        <CardTitle>Maladies Chroniques</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Ajouter une maladie..."
                                value={newDisease}
                                onChange={e => setNewDisease(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && addToList('chronicDiseases', newDisease, setNewDisease)}
                            />
                            <Button size="icon" onClick={() => addToList('chronicDiseases', newDisease, setNewDisease)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {record.chronicDiseases?.map((item: string, index: number) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                    <span>{item}</span>
                                    <Button variant="ghost" size="sm" onClick={() => removeFromList('chronicDiseases', index)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
