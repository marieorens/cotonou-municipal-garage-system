import { useState, useEffect } from 'react';
import { Search, Download, Filter, DollarSign, CreditCard, Smartphone, Building, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MockApiService } from '@/services/mockApi';
import { Payment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const PaymentsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const paymentsData = await MockApiService.getPayments();
        setPayments(paymentsData);
      } catch (error) {
        console.error('Erreur lors du chargement des paiements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMethod = paymentMethod === 'all' || payment.payment_method === paymentMethod;
    
    // Simple date filtering - in real app would use proper date comparison
    const matchesDate = dateRange === 'all' || true; // Simplified for demo
    
    return matchesSearch && matchesMethod && matchesDate;
  });

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="w-4 h-4" />;
      case 'mobile_money':
        return <Smartphone className="w-4 h-4" />;
      case 'bank_transfer':
        return <Building className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Espèces';
      case 'mobile_money':
        return 'Mobile Money';
      case 'bank_transfer':
        return 'Virement';
      default:
        return method;
    }
  };

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const thisMonth = payments.filter(p => 
    new Date(p.payment_date).getMonth() === new Date().getMonth()
  ).length;

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
            <CardDescription>Revenus total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paiements ce mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {thisMonth}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total paiements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {payments.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par référence, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Méthode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes</SelectItem>
            <SelectItem value="cash">Espèces</SelectItem>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
            <SelectItem value="bank_transfer">Virement</SelectItem>
          </SelectContent>
        </Select>
        
        {(user?.role === 'admin' || user?.role === 'finance') && (
          <Button 
            variant="outline"
            onClick={() => {
              const csvData = payments.map(p => ({
                Reference: p.reference,
                Montant: p.amount,
                Methode: p.payment_method,
                Date: new Date(p.payment_date).toLocaleDateString('fr-FR'),
                Description: p.description
              }));
              
              const csv = [
                Object.keys(csvData[0]).join(','),
                ...csvData.map(row => Object.values(row).join(','))
              ].join('\n');
              
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `paiements_${new Date().toLocaleDateString('fr-FR')}.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        )}
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
                <TableHead>Référence</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Chargement des paiements...
                  </TableCell>
                </TableRow>
              ) : filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Aucun paiement trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.reference}</TableCell>
                    <TableCell>ID: {payment.vehicle_id}</TableCell>
                    <TableCell>ID: {payment.owner_id}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMethodIcon(payment.payment_method)}
                        <span className="capitalize">{getMethodLabel(payment.payment_method)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(payment.payment_date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-success-light text-success">
                        Payé
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPayment(payment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du paiement</DialogTitle>
            <DialogDescription>
              Informations complètes du paiement sélectionné
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">Référence:</span>
                  <p className="font-medium">{selectedPayment.reference}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Montant:</span>
                  <p className="font-medium">{formatCurrency(selectedPayment.amount)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Véhicule:</span>
                  <p className="font-medium">ID: {selectedPayment.vehicle_id}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Propriétaire:</span>
                  <p className="font-medium">ID: {selectedPayment.owner_id}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Méthode:</span>
                  <p className="font-medium capitalize">{getMethodLabel(selectedPayment.payment_method)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <p className="font-medium">{new Date(selectedPayment.payment_date).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Description:</span>
                <p className="font-medium">{selectedPayment.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};