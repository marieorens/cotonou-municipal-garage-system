import { useEffect, useState } from 'react';
import { Car, AlertTriangle, CreditCard, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardStats, Vehicle } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch vehicles
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (vehiclesError) throw vehiclesError;
        setRecentVehicles((vehiclesData || []) as Vehicle[]);

        // Calculate dashboard stats
        const { data: allVehicles, error: statsError } = await supabase
          .from('vehicles')
          .select('status');

        if (statsError) throw statsError;

        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payment_transactions')
          .select('amount, created_at')
          .eq('status', 'completed')
          .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

        if (paymentsError) throw paymentsError;

        const vehiclesByStatus = allVehicles?.reduce((acc, vehicle) => {
          acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const monthlyRevenue = paymentsData?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;

        setStats({
          total_vehicles: allVehicles?.length || 0,
          vehicles_by_status: {
            impounded: vehiclesByStatus.impounded || 0,
            claimed: vehiclesByStatus.claimed || 0,
            sold: vehiclesByStatus.sold || 0,
            destroyed: vehiclesByStatus.destroyed || 0,
            pending_destruction: vehiclesByStatus.pending_destruction || 0,
          },
          monthly_revenue: monthlyRevenue,
          recent_payments: [],
          pending_procedures: 0, // TODO: Calculate from procedures table
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les données du tableau de bord',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'impounded': return 'destructive';
      case 'claimed': return 'secondary';
      case 'released': return 'default';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'impounded': return 'En fourrière';
      case 'claimed': return 'Réclamé';
      case 'released': return 'Libéré';
      default: return status;
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
        <h1 className="text-3xl font-bold text-foreground">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground">
          Bienvenue, {user?.name}. Voici un aperçu de l'activité de la fourrière.
        </p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Véhicules
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_vehicles}</div>
              <p className="text-xs text-muted-foreground">
                En fourrière municipale
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                En fourrière
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vehicles_by_status.impounded}</div>
              <p className="text-xs text-muted-foreground">
                Non réclamés
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Revenus du mois
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.monthly_revenue.toLocaleString()} FCFA
              </div>
              <p className="text-xs text-muted-foreground">
                Frais de fourrière
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Procédures en cours
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_procedures}</div>
              <p className="text-xs text-muted-foreground">
                À traiter
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Vehicles */}
      <Card>
        <CardHeader>
          <CardTitle>Véhicules récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.license_plate}</p>
                    <p className="text-sm text-muted-foreground">
                      {vehicle.make} {vehicle.model} - {vehicle.color}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={getStatusVariant(vehicle.status)}>
                    {getStatusLabel(vehicle.status)}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(vehicle.impound_date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
            {recentVehicles.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Aucun véhicule enregistré
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};