import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Phone, Mail, User, Car, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Owner } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const mockOwners: Owner[] = [
  {
    id: '1',
    first_name: 'Jean',
    last_name: 'ADJOVI',
    phone: '+229 97 12 34 56',
    email: 'jean.adjovi@gmail.com',
    address: 'Quartier Akpakpa, Cotonou',
    id_number: 'CI123456789',
    id_type: 'cni',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    first_name: 'Marie',
    last_name: 'DOSSOU',
    phone: '+229 96 87 65 43',
    email: 'marie.dossou@yahoo.fr',
    address: 'Quartier Godomey, Abomey-Calavi',
    id_number: 'CI987654321',
    id_type: 'cni',
    created_at: '2024-01-10T14:20:00Z',
    updated_at: '2024-01-16T09:15:00Z',
  },
  {
    id: '3',
    first_name: 'Ibrahim',
    last_name: 'ZAKARI',
    phone: '+229 95 11 22 33',
    email: '',
    address: 'Quartier Zongo, Cotonou',
    id_number: 'P789123456',
    id_type: 'passport',
    created_at: '2024-01-08T08:45:00Z',
    updated_at: '2024-01-12T16:30:00Z',
  },
];

export const OwnersPage = () => {
  const { hasAnyRole } = useAuth();
  const [owners, setOwners] = useState<Owner[]>(mockOwners);
  const [filteredOwners, setFilteredOwners] = useState<Owner[]>(mockOwners);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtered = owners;

    if (searchTerm) {
      filtered = filtered.filter(owner =>
        owner.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.phone.includes(searchTerm) ||
        owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const canEditOwners = hasAnyRole(['admin', 'agent']);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propriétaires</h1>
          <p className="text-muted-foreground">
            Gestion de la base de données des propriétaires de véhicules
          </p>
        </div>
        {canEditOwners && (
          <Button className="bg-municipal-gradient hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Nouveau propriétaire
          </Button>
        )}
      </div>

      {/* Search & Filters */}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div className="text-2xl font-bold">89%</div>
            <p className="text-sm text-muted-foreground">Taux de contact</p>
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Pièce d'identité</TableHead>
                  <TableHead>Date d'ajout</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOwners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" alt={`${owner.first_name} ${owner.last_name}`} />
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
                    <TableCell>
                      <p className="text-sm">{owner.address}</p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline">
                          {getIdTypeLabel(owner.id_type)}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{owner.id_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(owner.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <User className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Car className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <History className="h-4 w-4" />
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
    </div>
  );
};