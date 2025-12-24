"use client"

import { useDoctor } from "@/providers/doctor-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

const daysOfWeek = [
  { id: 0, name: "Dimanche" },
  { id: 1, name: "Lundi" },
  { id: 2, name: "Mardi" },
  { id: 3, name: "Mercredi" },
  { id: 4, name: "Jeudi" },
  { id: 5, name: "Vendredi" },
  { id: 6, name: "Samedi" },
]

export default function SchedulePage() {
  const { timeSlots, addTimeSlot, removeTimeSlot } = useDoctor()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    dayOfWeek: "0",
    startTime: "09:00",
    endTime: "17:00",
    type: "online",
    maxPatients: "3",
  })

  const handleAddSlot = async () => {
    await addTimeSlot({
      id: "",
      dayOfWeek: Number.parseInt(formData.dayOfWeek),
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type as "online" | "offline",
      maxPatients: Number.parseInt(formData.maxPatients),
    })
    setFormData({
      dayOfWeek: "0",
      startTime: "09:00",
      endTime: "17:00",
      type: "online",
      maxPatients: "3",
    })
    setShowForm(false)
  }

  return (
    <main className="flex-1 p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gérer votre emploi du temps</h1>
            <p className="text-muted-foreground">Définissez vos horaires de travail et vos créneaux disponibles</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un créneau
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un nouveau créneau</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Jour</label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  {daysOfWeek.map((day) => (
                    <option key={day.id} value={day.id}>
                      {day.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure de début</label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heure de fin</label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type de consultation</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="online">En ligne</option>
                  <option value="offline">En clinique</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre max. de patients</label>
                <Input
                  type="number"
                  value={formData.maxPatients}
                  onChange={(e) => setFormData({ ...formData, maxPatients: e.target.value })}
                  min="1"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddSlot} className="flex-1">
                  Enregistrer
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {daysOfWeek.map((day) => {
            const daySlots = timeSlots.filter((s) => s.dayOfWeek === day.id)
            return (
              <Card key={day.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{day.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {daySlots.length > 0 ? (
                    <div className="space-y-3">
                      {daySlots.map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between p-3 bg-muted rounded">
                          <div>
                            <p className="font-medium">
                              {slot.startTime} - {slot.endTime}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {slot.type === "online" ? "En ligne" : "En clinique"} • Max {slot.maxPatients} patients
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => removeTimeSlot(slot.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucun créneau défini pour ce jour</p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
