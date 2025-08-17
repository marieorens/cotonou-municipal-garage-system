import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateUserModal } from '@/components/CreateUserModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
}

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
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les utilisateurs',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.is_active : !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? <Badge variant="secondary" className="bg-success-light text-success">Actif</Badge>
      : <Badge variant="destructive">Inactif</Badge>;
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Utilisateur mis à jour',
        description: `L'utilisateur a été ${currentStatus ? 'désactivé' : 'activé'} avec succès`
      });

      fetchUsers();
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de modifier l\'utilisateur',
        variant: 'destructive'
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: 'Utilisateur supprimé',
        description: 'L\'utilisateur a été supprimé avec succès'
      });

      fetchUsers();
    } catch (err: any) {
      toast({
        title: 'Erreur',
        description: err.message || 'Impossible de supprimer l\'utilisateur',
        variant: 'destructive'
      });
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

  const activeUsers = users.filter(u => u.is_active).length;
  const inactiveUsers = users.filter(u => !u.is_active).length;

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
                <div className="text-2xl font-bold">{users.length}</div>
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
            
            <CreateUserModal onUserCreated={fetchUsers} />
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
                      <TableCell>{getStatusBadge(user.is_active)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
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
                            disabled={user.id === currentUser?.id}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          {user.id !== currentUser?.id && (
                            <>
                              {user.is_active ? (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => toggleUserStatus(user.id, user.is_active)}
                                  title="Désactiver"
                                >
                                  <UserX className="w-3 h-3" />
                                </Button>
                              ) : (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => toggleUserStatus(user.id, user.is_active)}
                                  title="Activer"
                                >
                                  <UserCheck className="w-3 h-3" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deleteUser(user.id)}
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
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