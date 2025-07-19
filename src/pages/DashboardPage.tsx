import { useEffect, useState } from 'react';
import { Car, Users, FileText, DollarSign, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardStats, Vehicle, Payment } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Mock data - à remplacer par de vraies données API
const mockStats: DashboardStats = {
  total_vehicles: 156,
  vehicles_by_status: {
    impounded: 89,
    claimed: 34,
    sold: 21,
    destroyed: 8,
    pending_destruction: 4,
  },
  monthly_revenue: 2500000, // en FCFA
  recent_payments: [],
  pending_procedures: 12,
};

const mockRecentVehicles: Vehicle[] = [
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
    photos: [],
    estimated_value: 5000000,
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
];

const StatusCard = ({ title, value, icon: Icon, variant, description }: {
  title: string;
  value: number | string;
  icon: any;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  description?: string;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 text-${variant}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recentVehicles, setRecentVehicles] = useState<Vehicle[]>(mockRecentVehicles);

  useEffect(() => {
    // Ici on chargerait les vraies données
    // fetchDashboardStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'impounded': return 'outline';
      case 'claimed': return 'default';
      case 'sold': return 'secondary';
      case 'destroyed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'impounded': return 'En fourrière';
      case 'claimed': return 'Réclamé';
      case 'sold': return 'Vendu';
      case 'destroyed': return 'Détruit';
      case 'pending_destruction': return 'En attente destruction';
      default: return status;
    }
  };

  const totalVehicles = stats.total_vehicles;
  const recoveryRate = ((stats.vehicles_by_status.claimed / totalVehicles) * 100).toFixed(1);

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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Véhicules totaux"
          value={stats.total_vehicles}
          icon={Car}
          variant="primary"
          description="Tous statuts confondus"
        />
        <StatusCard
          title="En fourrière"
          value={stats.vehicles_by_status.impounded}
          icon={AlertCircle}
          variant="warning"
          description="Actuellement stockés"
        />
        <StatusCard
          title="Procédures en cours"
          value={stats.pending_procedures}
          icon={FileText}
          variant="secondary"
          description="À traiter"
        />
        <StatusCard
          title="Revenus du mois"
          value={formatCurrency(stats.monthly_revenue)}
          icon={DollarSign}
          variant="success"
          description="Janvier 2024"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Répartition des véhicules
            </CardTitle>
            <CardDescription>
              Distribution par statut des véhicules dans le système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.vehicles_by_status).map(([status, count]) => {
              const percentage = (count / totalVehicles) * 100;
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {getStatusLabel(status)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques clés</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taux de récupération</span>
                <Badge variant="default">{recoveryRate}%</Badge>
              </div>
              <Progress value={parseFloat(recoveryRate)} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Véhicules vendus</span>
                <span className="text-sm font-medium">{stats.vehicles_by_status.sold}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Véhicules détruits</span>
                <span className="text-sm font-medium">{stats.vehicles_by_status.destroyed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activité récente
              </CardTitle>
              <CardDescription>
                Derniers véhicules enregistrés
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary" />
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};