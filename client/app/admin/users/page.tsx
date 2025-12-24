"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Trash2, Power, Edit } from "lucide-react"
import { api } from "@/lib/api"
import authService from "@/lib/auth"
import { toast } from "sonner"

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")

    const fetchUsers = async () => {
        try {
            const token = authService.getToken()
            let url = `${api.adminUsers}?limit=100`
            if (search) url += `&search=${search}`
            if (roleFilter !== "all") url += `&role=${roleFilter}`

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) {
                setUsers(data.data)
            }
        } catch (error) {
            console.error("Error fetching users:", error)
            toast.error("Erreur lors du chargement des utilisateurs")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [search, roleFilter])

    const toggleStatus = async (id: string) => {
        try {
            const token = authService.getToken()
            const response = await fetch(api.adminToggleStatus(id), {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) {
                toast.success(data.message)
                fetchUsers()
            }
        } catch (error) {
            toast.error("Erreur lors de la modification du statut")
        }
    }

    const deleteUser = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return

        try {
            const token = authService.getToken()
            const response = await fetch(api.adminUser(id), {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) {
                toast.success("Utilisateur supprimé")
                fetchUsers()
            }
        } catch (error) {
            toast.error("Erreur lors de la suppression")
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
                    <p className="text-muted-foreground">Gérez les comptes patients et médecins</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel Utilisateur
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom ou email..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">Tous les rôles</option>
                            <option value="patient">Patients</option>
                            <option value="doctor">Médecins</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date d'inscription</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Chargement...</TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">Aucun utilisateur trouvé</TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'admin' ? 'default' : user.role === 'doctor' ? 'secondary' : 'outline'}>
                                                {user.role === 'patient' ? 'Patient' : user.role === 'doctor' ? 'Médecin' : 'Admin'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isActive ? 'default' : 'destructive'} className={user.isActive ? "bg-green-500 hover:bg-green-600" : ""}>
                                                {user.isActive ? 'Actif' : 'Inactif'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => toggleStatus(user._id)} title={user.isActive ? "Désactiver" : "Activer"}>
                                                    <Power className={`w-4 h-4 ${user.isActive ? "text-red-500" : "text-green-500"}`} />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteUser(user._id)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
