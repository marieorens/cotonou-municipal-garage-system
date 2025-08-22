import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Filter, Download, Loader2, Eye, Calendar, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockService } from '@/services/mockService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentTransaction {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_date: string;
  receipt_number: string;
  created_at: string;
  storage_fees: number;
  administrative_fees: number;
  penalty_fees: number;
  days_impounded: number;
  vehicles: {
    id: string;
    license_plate: string;
    make: string;
    model: string;
    color: string;
    impound_date: string;
    status: string;
  };
  owners: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
}

interface VehicleWithFinancialData {
  id: string;
  license_plate: string;
  make: string;
  model: string;
  color: string;
  impound_date: string;
  status: string;
  daysSinceImpound: number;
  storageFees: number;
  adminFees: number;
  penaltyFees: number;
  totalDue: number;
  isPaid: boolean;
  amountPaid: number;
  remainingAmount: number;
  urgency: 'normal' | 'warning' | 'critical';
}

export const PaymentsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [vehicles, setVehicles] = useState<VehicleWithFinancialData[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleWithFinancialData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleWithFinancialData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch payments and vehicles with mock service
        const paymentsData = await mockService.getPayments();
        const vehiclesData = await mockService.getVehicles();
        
        // Convert payments to PaymentTransaction format
        const paymentTransactions = paymentsData.map(p => ({
          ...p,
          status: 'completed',
          receipt_number: `RECT-${p.id}`,
          storage_fees: 0,
          administrative_fees: 0,
          penalty_fees: 0,
          days_impounded: 0,
          vehicles: { id: p.vehicle_id, license_plate: '', make: '', model: '', color: '', impound_date: '', status: '' },
          owners: { first_name: '', last_name: '', phone: '', email: '' }
        }));
        setPayments(paymentTransactions);

        // Calculate financial data for each vehicle
        const vehiclesWithFinancialData = (vehiclesData || []).map(vehicle => {
          const daysSinceImpound = Math.floor((new Date().getTime() - new Date(vehicle.impound_date).getTime()) / (1000 * 60 * 60 * 24));
          const storageFees = daysSinceImpound * 2000; // 2000 FCFA par jour
          const adminFees = 15000; // Frais administratifs fixes
          const penaltyFees = daysSinceImpound > 30 ? 10000 : 0; // Pénalité après 30 jours
          const totalDue = storageFees + adminFees + penaltyFees;
          
          const existingPayment = paymentsData?.find(p => p.vehicle_id === vehicle.id);
          const isPaid = !!existingPayment;
          const amountPaid = existingPayment?.amount || 0;
          const remainingAmount = isPaid ? Math.max(0, totalDue - amountPaid) : totalDue;
          
          const urgency = daysSinceImpound > 30 ? 'critical' : daysSinceImpound > 15 ? 'warning' : 'normal' as const;
          
          return {
            ...vehicle,
            daysSinceImpound,
            storageFees,
            adminFees,
            penaltyFees,
            totalDue,
            isPaid,
            amountPaid,
            remainingAmount,
            urgency: urgency as 'warning' | 'normal' | 'critical'
          };
        });

        setVehicles(vehiclesWithFinancialData);
        setFilteredVehicles(vehiclesWithFinancialData);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données financières',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'paid') {
        filtered = filtered.filter(v => v.isPaid);
      } else if (statusFilter === 'unpaid') {
        filtered = filtered.filter(v => !v.isPaid);
      }
    }

    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(v => v.urgency === urgencyFilter);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, statusFilter, urgencyFilter]);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Critique</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="gap-1 bg-orange-100 text-orange-800"><Clock className="w-3 h-3" />Attention</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getStatusBadge = (isPaid: boolean) => {
    return isPaid 
      ? <Badge variant="secondary" className="bg-green-100 text-green-800">Payé</Badge>
      : <Badge variant="destructive">Non payé</Badge>;
  };

  // Calculate financial statistics
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalDue = vehicles.reduce((sum, v) => sum + v.remainingAmount, 0);
  const unpaidVehicles = vehicles.filter(v => !v.isPaid).length;
  const criticalVehicles = vehicles.filter(v => v.urgency === 'critical').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Suivi Financier</h1>
        <p className="text-muted-foreground">Surveillance des montants dus et délais de paiement</p>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <ExternalLink className="w-4 h-4 inline mr-1" />
            Les paiements se font exclusivement via le site du Trésor Public du Bénin
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Revenus perçus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Montants dus</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalDue)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Véhicules non payés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {unpaidVehicles}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Situations critiques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              {criticalVehicles}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par immatriculation, marque..."
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
            <SelectItem value="paid">Payés</SelectItem>
            <SelectItem value="unpaid">Non payés</SelectItem>
          </SelectContent>
        </Select>

        <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Urgence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="warning">Attention</SelectItem>
            <SelectItem value="critical">Critique</SelectItem>
          </SelectContent>
        </Select>
        
        {(user?.role === 'admin' || user?.role === 'finance') && (
          <Button 
            variant="outline"
            onClick={() => {
              const csvData = filteredVehicles.map(v => ({
                Immatriculation: v.license_plate,
                Vehicule: `${v.make} ${v.model}`,
                JoursEnFourriere: v.daysSinceImpound,
                MontantDu: v.remainingAmount,
                Statut: v.isPaid ? 'Payé' : 'Non payé',
                Urgence: v.urgency,
                DateEntree: new Date(v.impound_date).toLocaleDateString('fr-FR')
              }));
              
              const csv = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `suivi_financier_${new Date().toLocaleDateString('fr-FR')}.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter rapport
          </Button>
        )}
      </div>

      {/* Financial Monitoring Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi des créances par véhicule</CardTitle>
          <CardDescription>
            Montants dus, délais et statuts de paiement (paiements via Trésor Public)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Immatriculation</TableHead>
                  <TableHead className="hidden sm:table-cell">Véhicule</TableHead>
                  <TableHead className="min-w-[100px]">Jours</TableHead>
                  <TableHead className="min-w-[120px]">Montant dû</TableHead>
                  <TableHead className="hidden md:table-cell">Frais stockage</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="min-w-[100px]">Urgence</TableHead>
                  <TableHead className="min-w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Aucun véhicule trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.license_plate}</TableCell>
                      <TableCell className="hidden sm:table-cell">{vehicle.make} {vehicle.model}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          {vehicle.daysSinceImpound}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(vehicle.remainingAmount)}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {formatCurrency(vehicle.storageFees)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(vehicle.isPaid)}
                      </TableCell>
                      <TableCell>
                        {getUrgencyBadge(vehicle.urgency)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedVehicle(vehicle)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Financial Detail Dialog */}
      <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails financiers - {selectedVehicle?.license_plate}</DialogTitle>
            <DialogDescription>
              Calcul détaillé des frais et information de paiement
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Véhicule:</span>
                  <p className="font-medium">{selectedVehicle.make} {selectedVehicle.model}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Date d'entrée:</span>
                  <p className="font-medium">{new Date(selectedVehicle.impound_date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Jours en fourrière:</span>
                  <p className="font-medium">{selectedVehicle.daysSinceImpound} jours</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Statut:</span>
                  {getStatusBadge(selectedVehicle.isPaid)}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Calcul des frais</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Frais administratifs:</span>
                    <span className="font-medium">{formatCurrency(selectedVehicle.adminFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de stockage ({selectedVehicle.daysSinceImpound} jours × 2,000 FCFA):</span>
                    <span className="font-medium">{formatCurrency(selectedVehicle.storageFees)}</span>
                  </div>
                  {selectedVehicle.penaltyFees > 0 && (
                    <div className="flex justify-between">
                      <span>Frais de pénalité:</span>
                      <span className="font-medium">{formatCurrency(selectedVehicle.penaltyFees)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total à payer:</span>
                    <span>{formatCurrency(selectedVehicle.totalDue)}</span>
                  </div>
                  {selectedVehicle.isPaid && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Montant payé:</span>
                        <span>-{formatCurrency(selectedVehicle.amountPaid)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Restant dû:</span>
                        <span>{formatCurrency(selectedVehicle.remainingAmount)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Informations de paiement</h4>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-blue-800">
                    <strong>Les paiements se font exclusivement via le Trésor Public du Bénin</strong>
                  </p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Compte bancaire: BJ6600100100000010179081 </strong> </p>
                    <p><strong>Site web:</strong> <a href="https://tresorbenin.bj" className="text-blue-600 underline">tresorbenin.bj</a></p>
                    <p><strong>Le compte est intitulé:</strong>MISP/FRAIS FOURRIERE</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
