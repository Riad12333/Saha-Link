"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Download,
  Eye,
  Plus,
  Search,
  Calendar,
  Filter,
  Loader2,
  Trash2,
  Stethoscope,
  Upload,
  X
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string>("")
  const [viewingDoc, setViewingDoc] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  // Form State
  const [newDoc, setNewDoc] = useState({
    title: "",
    doctorName: "",
    type: "Analyse",
    date: new Date().toISOString().split('T')[0],
    fileUrl: ""
  })

  useEffect(() => {
    fetchMedicalRecord()
  }, [])

  const fetchMedicalRecord = async () => {
    try {
      const token = authService.getToken()
      const response = await fetch(api.medicalRecord, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.success && result.data) {
        setRecords(result.data.documents || [])
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error("Erreur de chargement")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier ne doit pas dépasser 5 Mo")
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format non supporté. Utilisez PDF, JPG ou PNG")
      return
    }

    setSelectedFile(file)

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFilePreview(base64String)
      setNewDoc({ ...newDoc, fileUrl: base64String })
    }
    reader.readAsDataURL(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFilePreview("")
    setNewDoc({ ...newDoc, fileUrl: "" })
  }

  const handleViewDocument = (doc: any) => {
    setViewingDoc(doc)
    setIsViewModalOpen(true)
  }

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const token = authService.getToken()
      // First get current record to preserve other fields (bloodType, etc)
      const getResponse = await fetch(api.medicalRecord, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const getResult = await getResponse.json()

      const currentRecord = getResult.data || {}
      const updatedDocuments = [...(currentRecord.documents || []), newDoc]

      const response = await fetch(api.medicalRecord, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...currentRecord,
          documents: updatedDocuments
        })
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Document ajouté avec succès")
        setRecords(updatedDocuments)
        setIsAddModalOpen(false)
        setNewDoc({
          title: "",
          doctorName: "",
          type: "Analyse",
          date: new Date().toISOString().split('T')[0],
          fileUrl: ""
        })
        setSelectedFile(null)
        setFilePreview("")
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteDocument = async (index: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce document ?")) return

    try {
      const token = authService.getToken()
      const getResponse = await fetch(api.medicalRecord, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const getResult = await getResponse.json()
      const currentRecord = getResult.data

      const updatedDocuments = currentRecord.documents.filter((_: any, i: number) => i !== index)

      const response = await fetch(api.medicalRecord, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...currentRecord,
          documents: updatedDocuments
        })
      })

      if (response.ok) {
        toast.success("Document supprimé")
        setRecords(updatedDocuments)
      }
    } catch (error) {
      toast.error("Erreur de suppression")
    }
  }

  const filteredRecords = records.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="flex-1 p-4 md:p-8 bg-slate-50/50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Documents Médicaux <span className="text-primary">📂</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">Conservez vos rapports et analyses en toute sécurité.</p>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Nouveau Document</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDocument} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du document</Label>
                  <Input
                    id="title"
                    placeholder="ex: Analyse de Sang Janvier"
                    required
                    value={newDoc.title}
                    onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newDoc.type}
                      onValueChange={val => setNewDoc({ ...newDoc, type: val })}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Analyse">Analyse</SelectItem>
                        <SelectItem value="Imagerie">Imagerie</SelectItem>
                        <SelectItem value="Ordonnance">Ordonnance</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={newDoc.date}
                      onChange={e => setNewDoc({ ...newDoc, date: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Médecin / Laboratoire</Label>
                  <Input
                    id="doctor"
                    placeholder="Nom du praticien"
                    value={newDoc.doctorName}
                    onChange={e => setNewDoc({ ...newDoc, doctorName: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Document (PDF, JPG, PNG - Max 5 Mo)</Label>
                  {!selectedFile ? (
                    <label htmlFor="file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-slate-400" />
                        <p className="text-sm text-slate-500 font-medium">Cliquez pour importer</p>
                        <p className="text-xs text-slate-400">PDF, JPG ou PNG</p>
                      </div>
                      <input
                        id="file"
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                          <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(2)} Ko</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={removeFile}
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={saving} className="w-full rounded-xl">
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Enregistrer le document
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par titre ou médecin..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
          </div>
          <Button variant="outline" className="rounded-2xl border-slate-200 bg-white px-6">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredRecords.length > 0 ? filteredRecords.map((record, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow group bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center p-6 gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-900 truncate">{record.title}</p>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest px-2 py-0 border-none bg-slate-100 text-slate-500">
                        {record.type}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-2">
                      <Stethoscope className="w-3.5 h-3.5" />
                      {record.doctorName || "Non spécifié"}
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(record.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleViewDocument(record)}
                      className="rounded-xl h-10 w-10 hover:bg-slate-100 hover:text-primary"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteDocument(index)}
                      className="rounded-xl h-10 w-10 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                <FileText className="w-8 h-8" />
              </div>
              <p className="text-slate-400 font-medium">Aucun document trouvé.</p>
              <p className="text-slate-300 text-xs mt-1">Commencez par ajouter votre premier rapport médical.</p>
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl p-0">
          <DialogHeader className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold">{viewingDoc?.title}</DialogTitle>
                <p className="text-sm text-slate-500 mt-1">
                  {viewingDoc?.doctorName} • {viewingDoc?.date && new Date(viewingDoc.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <a
                href={viewingDoc?.fileUrl}
                download={`${viewingDoc?.title}.${viewingDoc?.fileUrl?.startsWith('data:application/pdf') ? 'pdf' : 'jpg'}`}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-bold"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </a>
            </div>
          </DialogHeader>
          <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
            {viewingDoc?.fileUrl ? (
              viewingDoc.fileUrl.startsWith('data:application/pdf') ? (
                <iframe
                  src={viewingDoc.fileUrl}
                  className="w-full h-[600px] rounded-2xl border border-slate-200"
                  title="Document PDF"
                />
              ) : (
                <img
                  src={viewingDoc.fileUrl}
                  alt={viewingDoc.title}
                  className="w-full h-auto rounded-2xl border border-slate-200"
                />
              )
            ) : (
              <div className="flex items-center justify-center h-96 bg-slate-50 rounded-2xl">
                <p className="text-slate-400">Aucun fichier disponible</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function Alert({ children, variant, className }: any) {
  return (
    <div className={`p-4 rounded-xl text-xs border ${className}`}>
      {children}
    </div>
  )
}
