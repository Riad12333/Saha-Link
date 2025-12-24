"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, FileText, Eye } from "lucide-react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [medicalRecord, setMedicalRecord] = useState<any>(null)

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const token = authService.getToken()

      // Use the new API endpoint
      const response = await fetch(api.doctorPatients, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const patientsData = Array.isArray(result.data) ? result.data : []
          setPatients(patientsData.map((p: any) => ({
            ...p,
            lastVisit: p.lastVisit ? new Date(p.lastVisit).toLocaleDateString('fr-FR') : 'Jamais'
          })))
        }
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMedicalRecord = async (patientId: string) => {
    try {
      const token = authService.getToken()
      const response = await fetch(api.patientRecord(patientId), {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setMedicalRecord(data.data)
      } else {
        setMedicalRecord(null)
      }
    } catch (error) {
      console.error("Error fetching medical record:", error)
      setMedicalRecord(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Mes Patients</h1>
          <p className="text-muted-foreground">Gérez vos patients et consultez leurs dossiers</p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary animate-spin" />
          </div>
          <p className="text-muted-foreground mt-4">Chargement des patients...</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un patient..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Dernière Visite</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients
                    .filter((patient) =>
                      !searchTerm ||
                      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((patient) => (
                      <TableRow key={patient._id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">{patient.email}</div>
                          <div className="text-xs text-muted-foreground">{patient.phone}</div>
                        </TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => {
                                setSelectedPatient(patient)
                                fetchMedicalRecord(patient._id)
                              }}>
                                <FileText className="w-4 h-4 mr-2" />
                                Dossier Médical
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Dossier Médical: {patient.name}</DialogTitle>
                              </DialogHeader>
                              {medicalRecord ? (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-muted rounded-lg">
                                      <h3 className="font-semibold mb-2">Informations Générales</h3>
                                      <p><strong>Groupe Sanguin:</strong> {medicalRecord.bloodType || 'N/A'}</p>
                                      <p><strong>Taille:</strong> {medicalRecord.height} cm</p>
                                      <p><strong>Poids:</strong> {medicalRecord.weight} kg</p>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                      <h3 className="font-semibold mb-2">Contact Urgence</h3>
                                      <p><strong>Nom:</strong> {medicalRecord.emergencyContact?.name || 'N/A'}</p>
                                      <p><strong>Tél:</strong> {medicalRecord.emergencyContact?.phone || 'N/A'}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold mb-2 text-red-600">Allergies</h3>
                                    <ul className="list-disc list-inside">
                                      {medicalRecord.allergies?.length > 0 ?
                                        medicalRecord.allergies.map((a: string, i: number) => <li key={i}>{a}</li>) :
                                        <li>Aucune allergie connue</li>
                                      }
                                    </ul>
                                  </div>

                                  <div>
                                    <h3 className="font-semibold mb-2 text-blue-600">Maladies Chroniques</h3>
                                    <ul className="list-disc list-inside">
                                      {medicalRecord.chronicDiseases?.length > 0 ?
                                        medicalRecord.chronicDiseases.map((d: string, i: number) => <li key={i}>{d}</li>) :
                                        <li>Aucune maladie chronique</li>
                                      }
                                    </ul>
                                  </div>

                                  <div className="pt-4 border-t">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-primary" />
                                      Documents Médicaux
                                    </h3>
                                    <div className="grid gap-2">
                                      {medicalRecord.documents?.length > 0 ?
                                        medicalRecord.documents.map((doc: any, i: number) => (
                                          <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div>
                                              <p className="text-sm font-bold text-slate-900">{doc.title}</p>
                                              <p className="text-[10px] text-slate-500 font-medium">
                                                {doc.type} • {doc.doctorName} • {new Date(doc.date).toLocaleDateString('fr-FR')}
                                              </p>
                                            </div>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              className="h-8 w-8 text-primary"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (doc.fileUrl) {
                                                  let url = doc.fileUrl;
                                                  if (!url.startsWith('http') && !url.startsWith('data:')) {
                                                    url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${doc.fileUrl}`;
                                                  }
                                                  // Open in new tab (for data URIs this might be blocked by some browsers or open in same tab, but better than crashing)
                                                  const win = window.open();
                                                  if (win) {
                                                    win.document.write(`<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                                  } else {
                                                    window.open(url, '_blank');
                                                  }
                                                }
                                              }}
                                            >
                                              <Eye className="w-4 h-4" />
                                            </Button>
                                          </div>
                                        )) : (
                                          <p className="text-sm text-muted-foreground italic">Aucun document importé par le patient.</p>
                                        )
                                      }
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                  Chargement du dossier ou dossier vide...
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {patients.length === 0 && !loading && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Aucun patient pour le moment. Les patients apparaîtront ici après leur premier rendez-vous.
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
