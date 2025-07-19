import { useState } from 'react';
import { Search, CreditCard, Download, Plus, Filter, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockPayments = [
  {
    id: 'PAY001',
    vehicleId: 'VH001',
    plateNumber: 'AA 1234 AB',
    amount: 75000,
    status: 'paid',
    paymentDate: '2024-01-15',
    method: 'cash',
    receiptNumber: 'RCP001',
    ownerName: 'ADJOVI Jean'
  },
  {
    id: 'PAY002',
    vehicleId: 'VH002',
    plateNumber: 'BB 5678 CD',
    amount: 125000,
    status: 'pending',
    paymentDate: null,
    method: null,
    receiptNumber: null,
    ownerName: 'KOSSOU Marie'
  },
  {
    id: 'PAY003',
    vehicleId: 'VH003',
    plateNumber: 'CC 9012 EF',
    amount: 50000,
    status: 'paid',
    paymentDate: '2024-01-14',
    method: 'mobile_money',
    receiptNumber: 'RCP002',
    ownerName: 'TOGBE Paul'
  }
];

const mockTariffs = [
  { category: 'Voiture particulière', dailyRate: 5000, description: 'Véhicule léger de particulier' },
  { category: 'Motocyclette', dailyRate: 2500, description: 'Deux roues motorisé' },
  { category: 'Véhicule commercial', dailyRate: 10000, description: 'Véhicule utilitaire ou commercial' },
  { category: 'Poids lourd', dailyRate: 20000, description: 'Camion, bus, etc.' }
];

export const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary" className="bg-success-light text-success">Payé</Badge>;
      case 'pending':
        return <Badge variant="destructive">En attente</Badge>;
      case 'overdue':
        return <Badge variant="destructive">En retard</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string | null) => {
    switch (method) {
      case 'cash':
        return 'Espèces';
      case 'mobile_money':
        return 'Mobile Money';
      case 'bank_transfer':
        return 'Virement';
      default:
        return '-';
    }
  };

  const totalRevenue = mockPayments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = mockPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paiements</h1>
        <p className="text-muted-foreground">Gestion des encaissements et facturation</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenus encaissés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {totalRevenue.toLocaleString()} FCFA
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En attente de paiement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {pendingAmount.toLocaleString()} FCFA
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paiements ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockPayments.filter(p => p.status === 'paid').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par immatriculation, propriétaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="paid">Payé</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="overdue">En retard</SelectItem>
          </SelectContent>
        </Select>
        
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau paiement
        </Button>
        
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.plateNumber}</TableCell>
                  <TableCell>{payment.ownerName}</TableCell>
                  <TableCell className="font-semibold">
                    {payment.amount.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{getPaymentMethodLabel(payment.method)}</TableCell>
                  <TableCell>
                    {payment.paymentDate ? 
                      new Date(payment.paymentDate).toLocaleDateString('fr-FR') : 
                      '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {payment.status === 'paid' && (
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Reçu
                        </Button>
                      )}
                      {payment.status === 'pending' && (
                        <Button size="sm">
                          <CreditCard className="w-3 h-3 mr-1" />
                          Encaisser
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tariffs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grille tarifaire</CardTitle>
          <CardDescription>Tarifs de la fourrière par catégorie de véhicule</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Catégorie</TableHead>
                <TableHead>Tarif journalier</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTariffs.map((tariff, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{tariff.category}</TableCell>
                  <TableCell className="font-semibold">
                    {tariff.dailyRate.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>{tariff.description}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      Modifier
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};