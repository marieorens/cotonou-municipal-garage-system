import { useState } from 'react';
import { Search, Plus, UserCheck, UserX, Edit, Trash2, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockUsers = [
  {
    id: '1',
    name: 'HOUNSOU Admin',
    email: 'admin@mairie-cotonou.bj',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'ADJAHO Agent',
    email: 'agent@mairie-cotonou.bj',
    role: 'agent',
    status: 'active',
    lastLogin: '2024-01-14T16:45:00',
    createdAt: '2024-01-05'
  },
  {
    id: '3',
    name: 'GBENOU Finance',
    email: 'finance@mairie-cotonou.bj',
    role: 'finance',
    status: 'active',
    lastLogin: '2024-01-13T09:15:00',
    createdAt: '2024-01-10'
  },
  {
    id: '4',
    name: 'DOSSOU Agent2',
    email: 'agent2@mairie-cotonou.bj',
    role: 'agent',
    status: 'inactive',
    lastLogin: '2024-01-10T14:20:00',
    createdAt: '2024-01-08'
  }
];

const roles = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès complet au système',
    permissions: ['Tous les droits']
  },
  {
    id: 'agent',
    name: 'Agent de saisie',
    description: 'Saisie et gestion des véhicules',
    permissions: ['Créer véhicules', 'Modifier véhicules', 'Voir rapports']
  },
  {
    id: 'finance',
    name: 'Responsable financier',
    description: 'Gestion des paiements et finances',
    permissions: ['Voir paiements', 'Encaisser', 'Rapports financiers']
  }
];

export const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-success-light text-success">Actif</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default">Administrateur</Badge>;
      case 'agent':
        return <Badge variant="secondary">Agent</Badge>;
      case 'finance':
        return <Badge variant="outline">Finance</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const inactiveUsers = mockUsers.filter(u => u.status === 'inactive').length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground">Administration des comptes et des rôles</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="roles">Rôles et permissions</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUsers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Utilisateurs actifs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{activeUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Utilisateurs inactifs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{inactiveUsers}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel utilisateur
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un utilisateur</DialogTitle>
                  <DialogDescription>
                    Ajouter un nouvel utilisateur au système
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" placeholder="Nom et prénom" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@mairie-cotonou.bj" />
                  </div>
                  <div>
                    <Label htmlFor="role">Rôle</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="agent">Agent de saisie</SelectItem>
                        <SelectItem value="finance">Responsable financier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="password">Mot de passe temporaire</Label>
                    <Input id="password" type="password" placeholder="Mot de passe" />
                  </div>
                  <Button 
                    className="w-full"
                    onClick={async () => {
                      // Create user logic
                      console.log('Créer utilisateur');
                      // Simulate API call
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      setIsDialogOpen(false);
                      console.log('Utilisateur créé avec succès');
                    }}
                  >
                    Créer l'utilisateur
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Liste des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Nom</TableHead>
                      <TableHead className="hidden sm:table-cell min-w-[200px]">Email</TableHead>
                      <TableHead className="min-w-[100px]">Rôle</TableHead>
                      <TableHead className="min-w-[80px]">Statut</TableHead>
                      <TableHead className="hidden md:table-cell">Dernière connexion</TableHead>
                      <TableHead className="min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              // Edit user logic
                              console.log('Modifier utilisateur', user.id);
                            }}
                            title="Modifier"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                // Deactivate user logic
                                console.log('Désactiver utilisateur', user.id);
                              }}
                              title="Désactiver"
                            >
                              <UserX className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                // Activate user logic
                                console.log('Activer utilisateur', user.id);
                              }}
                              title="Activer"
                            >
                              <UserCheck className="w-3 h-3" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              // Delete user logic
                              if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
                                console.log('Supprimer utilisateur', user.id);
                              }
                            }}
                            title="Supprimer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {role.name}
                      </CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Edit role logic
                        console.log('Modifier rôle', role.id);
                      }}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Modifier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};