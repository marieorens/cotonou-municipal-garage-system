import { useState, useEffect } from 'react';
import { Search, Filter, Phone, Mail, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Owner } from '@/types';
import { toast } from '@/hooks/use-toast';
import { mockService } from '@/services/mockService';

export const OwnersPage = () => {
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        const data = await mockService.getOwners();
        setOwners(data);
        setFilteredOwners(data);
      } catch (error) {
        console.error('Error fetching owners:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger la liste des propriétaires',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  useEffect(() => {
    let filtered = owners;

    if (searchTerm) {
      filtered = filtered.filter(owner =>
        owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.phone.includes(searchTerm) ||
        (owner.email && owner.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        owner.id_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOwners(filtered);
  }, [owners, searchTerm]);

  const getIdTypeLabel = (type: string) => {
    switch (type) {
      case 'cni': return 'CNI';
      case 'passport': return 'Passeport';
      case 'driver_license': return 'Permis';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Propriétaires</h1>
        <p className="text-muted-foreground">
          Gestion de la base de données des propriétaires de véhicules
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, téléphone, email, ou numéro ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredOwners.length}</div>
            <p className="text-sm text-muted-foreground">Propriétaires trouvés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredOwners.filter(o => o.email).length}
            </div>
            <p className="text-sm text-muted-foreground">Avec email</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredOwners.filter(o => o.id_type === 'cni').length}
            </div>
            <p className="text-sm text-muted-foreground">CNI enregistrées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{owners.length}</div>
            <p className="text-sm text-muted-foreground">Total propriétaires</p>
          </CardContent>
        </Card>
      </div>

      {/* Owners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des propriétaires</CardTitle>
          <CardDescription>
            {filteredOwners.length} propriétaire(s) dans la base de données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Propriétaire</TableHead>
                  <TableHead className="min-w-[150px]">Contact</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[200px]">Adresse</TableHead>
                  <TableHead className="hidden lg:table-cell min-w-[150px]">Pièce d'identité</TableHead>
                  <TableHead className="hidden sm:table-cell">Date d'ajout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {owner.first_name[0]}{owner.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{owner.first_name} {owner.last_name}</p>
                          <p className="text-sm text-muted-foreground">ID: {owner.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {owner.phone}
                        </div>
                        {owner.email && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {owner.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm">{owner.address}</p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="space-y-1">
                        <Badge variant="outline">
                          {getIdTypeLabel(owner.id_type)}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{owner.id_number}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {new Date(owner.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredOwners.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun propriétaire trouvé
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};