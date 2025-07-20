import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Download, Eye, Edit, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Vehicle, VehicleStatus, VehicleType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    license_plate: 'AB-123-CD',
    make: 'Toyota',
    model: 'Corolla',
    color: 'Blanc',
    year: 2020,
    type: 'car',
    status: 'impounded',
    impound_date: '2024-01-15T10:30:00Z',
    location: 'Zone A-12',
    photos: ['photo1.jpg'],
    estimated_value: 5000000,
    description: 'Véhicule en bon état',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    license_plate: 'EF-456-GH',
    make: 'Honda',
    model: 'Civic',
    color: 'Rouge',
    year: 2019,
    type: 'car',
    status: 'claimed',
    impound_date: '2024-01-14T14:20:00Z',
    location: 'Zone B-08',
    photos: [],
    estimated_value: 4500000,
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-16T09:15:00Z',
  },
  {
    id: '3',
    license_plate: 'IJ-789-KL',
    make: 'Yamaha',
    model: 'MT-07',
    color: 'Noir',
    year: 2021,
    type: 'motorcycle',
    status: 'sold',
    impound_date: '2024-01-10T08:15:00Z',
    location: 'Zone C-05',
    photos: ['photo2.jpg', 'photo3.jpg'],
    estimated_value: 2800000,
    created_at: '2024-01-10T08:15:00Z',
    updated_at: '2024-01-18T16:45:00Z',
  },
];

export const VehiclesListPage = () => {
  const { hasAnyRole } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<VehicleType | 'all'>('all');

  useEffect(() => {
    let filtered = vehicles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.color.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === typeFilter);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, statusFilter, typeFilter]);

  const getStatusVariant = (status: VehicleStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'impounded': return 'outline';
      case 'claimed': return 'default';
      case 'sold': return 'secondary';
      case 'destroyed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: VehicleStatus) => {
    switch (status) {
      case 'impounded': return 'En fourrière';
      case 'claimed': return 'Réclamé';
      case 'sold': return 'Vendu';
      case 'destroyed': return 'Détruit';
      case 'pending_destruction': return 'En attente destruction';
      default: return status;
    }
  };

  const getTypeLabel = (type: VehicleType) => {
    switch (type) {
      case 'car': return 'Voiture';
      case 'motorcycle': return 'Moto';
      case 'truck': return 'Camion';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const canEditVehicles = hasAnyRole(['admin', 'agent']);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Véhicules</h1>
          <p className="text-muted-foreground">
            Gestion des véhicules en fourrière
          </p>
        </div>
        {canEditVehicles && (
          <Button asChild className="bg-municipal-gradient hover:opacity-90 w-full sm:w-auto">
            <Link to="/app/vehicules/nouveau">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau véhicule
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par plaque, marque, modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="impounded">En fourrière</SelectItem>
                <SelectItem value="claimed">Réclamé</SelectItem>
                <SelectItem value="sold">Vendu</SelectItem>
                <SelectItem value="destroyed">Détruit</SelectItem>
                <SelectItem value="pending_destruction">En attente destruction</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="car">Voiture</SelectItem>
                <SelectItem value="motorcycle">Moto</SelectItem>
                <SelectItem value="truck">Camion</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{filteredVehicles.length}</div>
            <p className="text-sm text-muted-foreground">Véhicules trouvés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredVehicles.filter(v => v.status === 'impounded').length}
            </div>
            <p className="text-sm text-muted-foreground">En fourrière</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {filteredVehicles.filter(v => v.status === 'claimed').length}
            </div>
            <p className="text-sm text-muted-foreground">Réclamés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {formatCurrency(filteredVehicles.reduce((sum, v) => sum + v.estimated_value, 0))}
            </div>
            <p className="text-sm text-muted-foreground">Valeur totale</p>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des véhicules</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const csvData = filteredVehicles.map(v => ({
                    Plaque: v.license_plate,
                    Marque: v.make,
                    Modele: v.model,
                    Type: v.type,
                    Statut: v.status,
                    Date_Fourriere: new Date(v.impound_date).toLocaleDateString('fr-FR'),
                    Localisation: v.location,
                    Valeur: v.estimated_value
                  }));
                  
                  const csv = [
                    Object.keys(csvData[0]).join(','),
                    ...csvData.map(row => Object.values(row).join(','))
                  ].join('\n');
                  
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `vehicules_${new Date().toLocaleDateString('fr-FR')}.csv`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Plaque</TableHead>
                  <TableHead className="min-w-[160px]">Véhicule</TableHead>
                  <TableHead className="hidden sm:table-cell">Type</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="hidden md:table-cell min-w-[140px]">Date mise en fourrière</TableHead>
                  <TableHead className="hidden lg:table-cell">Localisation</TableHead>
                  <TableHead className="hidden xl:table-cell min-w-[120px]">Valeur estimée</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      {vehicle.license_plate}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vehicle.make} {vehicle.model}</p>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.color} - {vehicle.year}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{getTypeLabel(vehicle.type)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(vehicle.status)} className="text-xs">
                        {getStatusLabel(vehicle.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(vehicle.impound_date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{vehicle.location}</TableCell>
                    <TableCell className="hidden xl:table-cell">{formatCurrency(vehicle.estimated_value)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/app/vehicules/${vehicle.id}`}>
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Link>
                        </Button>
                        {canEditVehicles && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/app/vehicules/${vehicle.id}/edit`}>
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => console.log('Générer QR Code pour véhicule', vehicle.id)}
                          title="Générer QR Code"
                        >
                          <QrCode className="h-3 w-3 sm:h-4 sm:w-4" />
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