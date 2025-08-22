import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';
import { Vehicle, Owner } from '@/types';
import { mockService } from '@/services/mockService';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    kkiapay: any;
  }
}

// You need to add your KKIAPAY API key here
const KKIAPAY_API_KEY = "your-kkiapay-api-key-here";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  owner: Owner | null;
  amount: number;
  breakdown: {
    storageFees: number;
    adminFees: number;
    penaltyFees: number;
    daysImpounded: number;
  };
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  owner,
  amount,
  breakdown
}) => {
  const [isKkiapayLoaded, setIsKkiapayLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  useEffect(() => {
    // Load KKiAPay script
    if (!window.kkiapay) {
      const script = document.createElement('script');
      script.src = 'https://cdn.kkiapay.me/k.js';
      script.async = true;
      script.onload = () => {
        setIsKkiapayLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsKkiapayLoaded(true);
    }
  }, []);

  const handlePayment = async (method: 'mobile_money' | 'card') => {
    if (!vehicle || !owner || !isKkiapayLoaded) return;

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Create payment record with mock service
      const paymentData = await mockService.createPayment({
        vehicle_id: vehicle.id,
        owner_id: owner.id,
        amount,
        payment_method: method,
        description: `Paiement pour véhicule ${vehicle.license_plate}`
      });

      // Create KKIAPAY widget element
      const widgetContainer = document.createElement('div');
      widgetContainer.innerHTML = `
        <kkiapay-widget 
          amount="${amount}"
          key="${KKIAPAY_API_KEY}"
          position="center"
          sandbox="true"
          data='{"email":"${owner.email || 'noreply@cotonou.bj'}","name":"${owner.first_name} ${owner.last_name}","phone":"${owner.phone}"}'
          callback="">
        </kkiapay-widget>
      `;
      
      document.body.appendChild(widgetContainer);
      
      // Add success callback
      window.addEventListener('kkiapay.success', async (event: any) => {
        try {
          // Simulate payment completion
          setPaymentStatus('success');

          setPaymentStatus('success');
          toast({
            title: 'Paiement réussi',
            description: 'Le paiement a été traité avec succès. Votre reçu sera généré automatiquement.'
          });

          // Generate receipt automatically
          setTimeout(() => {
            generateReceipt(paymentData);
          }, 1000);

          // Clean up widget
          document.body.removeChild(widgetContainer);

        } catch (err) {
          console.error('Error updating payment:', err);
          setPaymentStatus('failed');
        }
      });

      // Add failure callback
      window.addEventListener('kkiapay.failed', () => {
        setPaymentStatus('failed');
        document.body.removeChild(widgetContainer);
      });

    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentStatus('failed');
      toast({
        title: 'Erreur de paiement',
        description: err.message || 'Une erreur est survenue lors du paiement',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateReceipt = async (paymentData: any) => {
    try {
      // Dynamic import of jsPDF to avoid SSR issues
      const { default: jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('MAIRIE DE COTONOU', 105, 20, { align: 'center' });
      doc.setFontSize(16);
      doc.text('REÇU DE PAIEMENT', 105, 30, { align: 'center' });
      
      // Receipt details
      doc.setFontSize(12);
      const y = 50;
      doc.text(`Numéro de reçu: ${paymentData.receipt_number || 'En cours de génération'}`, 20, y);
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, y + 10);
      doc.text(`Heure: ${new Date().toLocaleTimeString('fr-FR')}`, 20, y + 20);
      
      // Vehicle info
      doc.text('INFORMATIONS DU VÉHICULE:', 20, y + 40);
      doc.text(`Plaque d'immatriculation: ${vehicle?.license_plate}`, 20, y + 50);
      doc.text(`Marque/Modèle: ${vehicle?.make} ${vehicle?.model}`, 20, y + 60);
      doc.text(`Couleur: ${vehicle?.color}`, 20, y + 70);
      doc.text(`Jours de fourrière: ${breakdown.daysImpounded}`, 20, y + 80);
      
      // Owner info
      doc.text('PROPRIÉTAIRE:', 20, y + 100);
      doc.text(`Nom: ${owner?.first_name} ${owner?.last_name}`, 20, y + 110);
      doc.text(`Téléphone: ${owner?.phone}`, 20, y + 120);
      doc.text(`Email: ${owner?.email || 'Non renseigné'}`, 20, y + 130);
      
      // Payment breakdown
      doc.text('DÉTAIL DES FRAIS:', 20, y + 150);
      doc.text(`Frais de garde: ${breakdown.storageFees.toLocaleString()} FCFA`, 20, y + 160);
      doc.text(`Frais administratifs: ${breakdown.adminFees.toLocaleString()} FCFA`, 20, y + 170);
      doc.text(`Frais de pénalité: ${breakdown.penaltyFees.toLocaleString()} FCFA`, 20, y + 180);
      
      // Total
      doc.setFontSize(14);
      doc.text(`TOTAL PAYÉ: ${amount.toLocaleString()} FCFA`, 20, y + 200);
      
      // Footer
      doc.setFontSize(10);
      doc.text('Ce reçu certifie le paiement intégral des frais de fourrière.', 105, y + 230, { align: 'center' });
      doc.text('Merci pour votre paiement.', 105, y + 240, { align: 'center' });
      
      // Save PDF
      const filename = `recu_${vehicle?.license_plate}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      toast({
        title: 'Reçu généré',
        description: 'Votre reçu de paiement a été téléchargé.'
      });
      
    } catch (err) {
      console.error('Error generating receipt:', err);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le reçu',
        variant: 'destructive'
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  if (!vehicle || !owner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Paiement des frais de fourrière</DialogTitle>
          <DialogDescription>
            Véhicule: {vehicle.license_plate} - {vehicle.make} {vehicle.model}
          </DialogDescription>
        </DialogHeader>

        {paymentStatus === 'success' ? (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Paiement effectué avec succès ! Votre reçu a été généré.
              </AlertDescription>
            </Alert>
            <Button onClick={onClose} className="w-full">
              Fermer
            </Button>
          </div>
        ) : paymentStatus === 'failed' ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Le paiement a échoué. Veuillez réessayer.
              </AlertDescription>
            </Alert>
            <Button onClick={() => setPaymentStatus('idle')} variant="outline" className="w-full">
              Réessayer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Payment summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Récapitulatif des frais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Frais de garde ({breakdown.daysImpounded} jours)</span>
                  <span>{formatCurrency(breakdown.storageFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais administratifs</span>
                  <span>{formatCurrency(breakdown.adminFees)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de pénalité</span>
                  <span>{formatCurrency(breakdown.penaltyFees)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total à payer</span>
                  <span>{formatCurrency(amount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment methods */}
            <div className="space-y-3">
              <h3 className="font-medium">Choisissez votre méthode de paiement:</h3>
              
              <Button
                onClick={() => handlePayment('mobile_money')}
                disabled={!isKkiapayLoaded || isProcessing}
                className="w-full h-12 text-left justify-start"
                variant="outline"
              >
                <Smartphone className="mr-3 h-5 w-5" />
                <div>
                  <div className="font-medium">Mobile Money</div>
                  <div className="text-sm text-muted-foreground">
                    MTN Mobile Money, Moov Money, Celtiis Cash
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handlePayment('card')}
                disabled={!isKkiapayLoaded || isProcessing}
                className="w-full h-12 text-left justify-start"
                variant="outline"
              >
                <CreditCard className="mr-3 h-5 w-5" />
                <div>
                  <div className="font-medium">Carte bancaire</div>
                  <div className="text-sm text-muted-foreground">
                    Visa, Mastercard
                  </div>
                </div>
              </Button>
            </div>

            {!isKkiapayLoaded && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Chargement du système de paiement...
                </AlertDescription>
              </Alert>
            )}

            {paymentStatus === 'processing' && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Traitement du paiement en cours...
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};