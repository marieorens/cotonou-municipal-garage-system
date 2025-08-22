import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Car, User, Calendar, CreditCard, FileText, ArrowLeft } from 'lucide-react';
import { PaymentModal } from '@/components/PaymentModal';
import { mockService } from '@/services/mockService';
import { Vehicle, Owner } from '@/types';
import { toast } from '@/hooks/use-toast';

export const VehiclePaymentPage = () => {
  const { licensePlate } = useParams<{ licensePlate: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  // Calculate fees (same logic as PaymentsPage)
  const calculateFees = (impoundDate: string) => {
    const daysImpounded = Math.floor((Date.now() - new Date(impoundDate).getTime()) / (1000 * 60 * 60 * 24));
    const dailyRate = 2000; // 2000 FCFA per day
    const baseAdminFee = 10000; // 10000 FCFA base
    const penaltyRate = daysImpounded > 30 ? 1000 * (daysImpounded - 30) : 0;
    
    const storageFees = daysImpounded * dailyRate;
    const adminFees = baseAdminFee;
    const penaltyFees = penaltyRate;
    const totalDue = storageFees + adminFees + penaltyFees;

    return {
      daysImpounded,
      storageFees,
      adminFees,
      penaltyFees,
      totalDue
    };
  };

  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!licensePlate) return;

      try {
        setIsLoading(true);

        // Fetch vehicle by license plate
        const { data: vehicleData, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('license_plate', licensePlate.toUpperCase())
          .single();

        if (vehicleError) {
          if (vehicleError.code === 'PGRST116') {
            toast({
              title: 'Véhicule non trouvé',
              description: 'Aucun véhicule trouvé avec cette plaque d\'immatriculation',
              variant: 'destructive'
            });
            return;
          }
          throw vehicleError;
        }

        setVehicle(vehicleData as Vehicle);

        // Fetch owner if vehicle has owner_id
        if (vehicleData.owner_id) {
          const { data: ownerData, error: ownerError } = await supabase
            .from('owners')
            .select('*')
            .eq('id', vehicleData.owner_id)
            .single();

          if (ownerError) throw ownerError;
          setOwner(ownerData as Owner);
        }

        // Fetch payment history
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payment_transactions')
          .select('*')
          .eq('vehicle_id', vehicleData.id)
          .order('created_at', { ascending: false });

        if (paymentsError) throw paymentsError;
        setPaymentHistory(paymentsData || []);

      } catch (err: any) {
        console.error('Error fetching vehicle data:', err);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données du véhicule',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, [licensePlate]);

  if (!licensePlate) {
    return <Navigate to="/vehicule-lookup" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Chargement des informations...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Véhicule non trouvé</CardTitle>
            <CardDescription>
              Aucun véhicule trouvé avec la plaque: {licensePlate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.history.back()} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fees = calculateFees(vehicle.impound_date);
  const completedPayments = paymentHistory.filter(p => p.status === 'completed');
  const totalPaid = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = Math.max(0, fees.totalDue - totalPaid);
  const isPaid = remainingAmount === 0;

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'impounded':
        return <Badge variant="destructive">En fourrière</Badge>;
      case 'released':
        return <Badge variant="secondary" className="bg-success-light text-success">Libéré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => window.history.back()} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Paiement des frais de fourrière</h1>
            <p className="text-muted-foreground">
              Consultez et payez les frais pour votre véhicule
            </p>
          </div>
        </div>

        {/* Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Informations du véhicule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Plaque d'immatriculation</p>
                <p className="font-medium text-lg">{vehicle.license_plate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                {getStatusBadge(vehicle.status)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Marque/Modèle</p>
                <p className="font-medium">{vehicle.make} {vehicle.model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Couleur</p>
                <p className="font-medium">{vehicle.color}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de mise en fourrière</p>
                <p className="font-medium">
                  {new Date(vehicle.impound_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jours en fourrière</p>
                <p className="font-medium">{fees.daysImpounded} jours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Info */}
        {owner && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Propriétaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">{owner.first_name} {owner.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{owner.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{owner.email || 'Non renseigné'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pièce d'identité</p>
                  <p className="font-medium">{owner.id_type}: {owner.id_number}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Récapitulatif des frais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Frais de garde ({fees.daysImpounded} jours à 2,000 FCFA/jour)</span>
                <span className="font-medium">{formatCurrency(fees.storageFees)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais administratifs</span>
                <span className="font-medium">{formatCurrency(fees.adminFees)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de pénalité</span>
                <span className="font-medium">{formatCurrency(fees.penaltyFees)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total des frais</span>
                <span>{formatCurrency(fees.totalDue)}</span>
              </div>
              {totalPaid > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Montant déjà payé</span>
                    <span>-{formatCurrency(totalPaid)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Montant restant à payer</span>
                    <span className={remainingAmount === 0 ? 'text-green-600' : ''}>
                      {formatCurrency(remainingAmount)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {isPaid ? (
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  Tous les frais ont été payés. Vous pouvez récupérer votre véhicule.
                </AlertDescription>
              </Alert>
            ) : (
              <Button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full"
                size="lg"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Payer {formatCurrency(remainingAmount)}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        {paymentHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Historique des paiements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString('fr-FR')} - {payment.payment_method}
                      </p>
                      {payment.receipt_number && (
                        <p className="text-xs text-muted-foreground">
                          Reçu: {payment.receipt_number}
                        </p>
                      )}
                    </div>
                    <Badge 
                      variant={payment.status === 'completed' ? 'secondary' : 'destructive'}
                      className={payment.status === 'completed' ? 'bg-success-light text-success' : ''}
                    >
                      {payment.status === 'completed' ? 'Payé' : payment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        vehicle={vehicle}
        owner={owner}
        amount={remainingAmount}
        breakdown={{
          storageFees: fees.storageFees,
          adminFees: fees.adminFees,
          penaltyFees: fees.penaltyFees,
          daysImpounded: fees.daysImpounded
        }}
      />
    </div>
  );
};