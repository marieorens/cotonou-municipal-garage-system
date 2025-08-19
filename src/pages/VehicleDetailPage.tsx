import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, User, FileText, Download, MessageCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Vehicle, Owner } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import municipalBuilding from '@/assets/cotonou-municipal-building.jpg';

// Mock data
const mockVehicle: Vehicle = {
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
  photos: [municipalBuilding],
  estimated_value: 5000000,
  description: 'Véhicule en bon état général. Quelques rayures mineures sur le côté droit.',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:30:00Z',
};

const mockOwner: Owner = {
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
};

const timeline = [
  {
    date: '2024-01-15T10:30:00Z',
    action: 'Mise en fourrière',
    description: 'Véhicule saisi pour stationnement interdit',
    user: 'Agent KOFFI',
  },
  {
    date: '2024-01-15T14:00:00Z',
    action: 'Notification envoyée',
    description: 'SMS envoyé au propriétaire',
    user: 'Système',
  },
  {
    date: '2024-01-16T09:15:00Z',
    action: 'Contact propriétaire',
    description: 'Propriétaire contacté par téléphone',
    user: 'Agent MARTIN',
  },
];

export const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();
  const { toast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data: vehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (vehicleError) throw vehicleError;
        setVehicle(vehicle as Vehicle);
        
        if (vehicle?.owner_id) {
          const { data: owner, error: ownerError } = await supabase
            .from('owners')
            .select('*')
            .eq('id', vehicle.owner_id)
            .single();
          
          if (!ownerError && owner) {
            setOwner(owner as Owner);
          }
        }
      } catch (error) {
        console.error('Failed to fetch vehicle:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les détails du véhicule',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id, toast]);

  const canEdit = hasAnyRole(['admin', 'agent']);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Véhicule introuvable</h2>
          <p className="text-muted-foreground mb-4">Le véhicule demandé n'existe pas.</p>
          <Button onClick={() => navigate('/app/vehicules')}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const daysSinceImpound = Math.floor(
    (Date.now() - new Date(vehicle.impound_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/app/vehicules')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {vehicle.license_plate}
            </h1>
            <p className="text-muted-foreground">
              {vehicle.make} {vehicle.model} - {vehicle.color} ({vehicle.year})
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(vehicle.status)} className="text-sm">
            {getStatusLabel(vehicle.status)}
          </Badge>
          {canEdit && (
            <Button variant="outline" asChild>
              <Link to={`/app/vehicules/${vehicle.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Alert for days in pound */}
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span className="font-medium text-orange-800 dark:text-orange-200">
              Véhicule en fourrière depuis {daysSinceImpound} jour(s)
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="timeline">Chronologie</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du véhicule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="font-medium">
                        {vehicle.type === 'car' ? 'Voiture' : 
                         vehicle.type === 'motorcycle' ? 'Moto' : 
                         vehicle.type === 'truck' ? 'Camion' : 'Autre'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Année</p>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Localisation</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {vehicle.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valeur estimée</p>
                      <p className="font-medium flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatCurrency(vehicle.estimated_value)}
                      </p>
                    </div>
                  </div>
                  
                  {vehicle.description && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-sm">{vehicle.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chronologie du dossier</CardTitle>
                  <CardDescription>
                    Historique des actions sur ce véhicule
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          {index < timeline.length - 1 && (
                            <div className="w-px h-12 bg-border"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{event.action}</h4>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(event.date)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Par: {event.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Information */}
          {owner && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Propriétaire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" alt={`${owner.first_name} ${owner.last_name}`} />
                    <AvatarFallback>
                      {owner.first_name[0]}{owner.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{owner.first_name} {owner.last_name}</p>
                    <p className="text-sm text-muted-foreground">{owner.phone}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p>{owner.email || 'Non renseigné'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Adresse</p>
                    <p>{owner.address}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pièce d'identité</p>
                    <p>{owner.id_number}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      if (owner.phone) {
                        window.open(`tel:${owner.phone}`, '_self');
                      }
                    }}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Contacter
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      // Navigation vers l'historique du propriétaire
                      console.log('Afficher historique du propriétaire:', owner.id);
                    }}
                  >
                    <History className="h-3 w-3 mr-1" />
                    Historique
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  // Générer et télécharger le PV
                  console.log('Générer PV pour véhicule:', vehicle.id);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Générer PV
              </Button>
              {hasAnyRole(['admin', 'agent']) && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate(`/app/procedures/new?vehicle_id=${vehicle.id}`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Nouvelle procédure
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  // Calculer et afficher les frais
                  console.log('Calculer frais pour véhicule:', vehicle.id);
                }}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Calculer frais
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};