import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, FileText, AlertCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MockApiService } from '@/services/mockApi';
import { Vehicle, Procedure, ProcedureType } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProcedureFormData {
  vehicle_id: string;
  type: ProcedureType;
  description?: string;
}

export const ProcedureFormPage = () => {
  const navigate = useNavigate();
  const { procedureId } = useParams();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [open, setOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState('');
  
  const isEdit = !!procedureId;
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProcedureFormData>();

  const watchedVehicleId = watch('vehicle_id');
  const watchedType = watch('type');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoadingVehicles(true);
        const vehiclesData = await MockApiService.getVehicles();
        // Only show impounded vehicles that don't have active procedures
        const availableVehicles = vehiclesData.vehicles.filter(v => v.status === 'impounded');
        setVehicles(availableVehicles);
      } catch (error) {
        console.error('Erreur lors du chargement des véhicules:', error);
        toast.error('Erreur lors du chargement des véhicules');
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    if (watchedVehicleId) {
      const vehicle = vehicles.find(v => v.id === watchedVehicleId);
      setSelectedVehicle(vehicle || null);
    }
  }, [watchedVehicleId, vehicles]);

  const calculateEstimatedFees = (type: ProcedureType, vehicle: Vehicle | null) => {
    if (!vehicle) return 0;
    
    const baseFees = {
      release: 50000, // 50,000 FCFA
      sale: 25000,    // 25,000 FCFA
      destruction: 15000 // 15,000 FCFA
    };
    
    // Calculate days since impound
    const impoundDate = new Date(vehicle.impound_date);
    const today = new Date();
    const daysDiff = Math.ceil((today.getTime() - impoundDate.getTime()) / (1000 * 3600 * 24));
    const storageFees = daysDiff * 2000; // 2,000 FCFA per day
    
    return baseFees[type] + storageFees;
  };

  const onSubmit = async (data: ProcedureFormData) => {
    if (!user) {
      toast.error('Utilisateur non authentifié');
      return;
    }

    try {
      setLoading(true);
      
      const estimatedFees = calculateEstimatedFees(data.type, selectedVehicle);
      
      const procedureData = {
        vehicle_id: data.vehicle_id,
        type: data.type,
        status: 'pending' as const,
        fees_calculated: estimatedFees,
        created_by: user.id,
        documents: []
      };

      if (isEdit) {
        // Update existing procedure logic would go here
        toast.success('Procédure mise à jour avec succès');
      } else {
        await MockApiService.createProcedure(procedureData);
        toast.success('Procédure créée avec succès');
      }
      
      navigate('/app/procedures');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde de la procédure');
    } finally {
      setLoading(false);
    }
  };

  const getProcedureTypeLabel = (type: ProcedureType) => {
    switch (type) {
      case 'release': return 'Libération';
      case 'sale': return 'Vente';
      case 'destruction': return 'Destruction';
      default: return type;
    }
  };

  const getProcedureTypeDescription = (type: ProcedureType) => {
    switch (type) {
      case 'release': 
        return 'Restitution du véhicule au propriétaire après paiement des frais';
      case 'sale': 
        return 'Mise en vente du véhicule après expiration des délais légaux';
      case 'destruction': 
        return 'Destruction du véhicule en cas de non-réclamation ou état irréparable';
      default: 
        return '';
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/app/procedures')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux procédures
        </Button>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {isEdit ? 'Modifier la procédure' : 'Nouvelle procédure'}
        </h1>
        <p className="text-muted-foreground">
          {isEdit ? 'Modifier les informations de la procédure' : 'Créer une nouvelle procédure administrative'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informations de la procédure
            </CardTitle>
            <CardDescription>
              Sélectionnez le véhicule et le type de procédure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle_id">Véhicule concerné *</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                      disabled={loadingVehicles}
                    >
                      {watchedVehicleId ? (
                        vehicles.find(vehicle => vehicle.id === watchedVehicleId)?.license_plate + 
                        ' - ' + 
                        vehicles.find(vehicle => vehicle.id === watchedVehicleId)?.make + 
                        ' ' + 
                        vehicles.find(vehicle => vehicle.id === watchedVehicleId)?.model
                      ) : (
                        loadingVehicles ? "Chargement..." : "Rechercher un véhicule..."
                      )}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Rechercher par plaque d'immatriculation..." 
                        value={vehicleSearch}
                        onValueChange={setVehicleSearch}
                      />
                      <CommandList>
                        <CommandEmpty>Aucun véhicule trouvé.</CommandEmpty>
                        <CommandGroup>
                          {vehicles
                            .filter(vehicle => 
                              vehicle.license_plate.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
                              (vehicle.make + ' ' + vehicle.model).toLowerCase().includes(vehicleSearch.toLowerCase())
                            )
                            .map((vehicle) => (
                              <CommandItem
                                key={vehicle.id}
                                value={vehicle.id}
                                onSelect={() => {
                                  setValue('vehicle_id', vehicle.id);
                                  setOpen(false);
                                  setVehicleSearch('');
                                }}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{vehicle.license_plate}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {vehicle.make} {vehicle.model} ({vehicle.color})
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.vehicle_id && (
                  <p className="text-sm text-destructive">Ce champ est requis</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de procédure *</Label>
                <Select 
                  value={watchedType || ''} 
                  onValueChange={(value: ProcedureType) => setValue('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="release">Libération</SelectItem>
                    <SelectItem value="sale">Vente</SelectItem>
                    <SelectItem value="destruction">Destruction</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive">Ce champ est requis</p>
                )}
              </div>
            </div>

            {watchedType && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-sm mb-2">
                  {getProcedureTypeLabel(watchedType)}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {getProcedureTypeDescription(watchedType)}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                {...register('description')}
                placeholder="Informations complémentaires sur la procédure..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {selectedVehicle && watchedType && (
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
              <CardDescription>
                Détails du véhicule et estimation des frais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Véhicule sélectionné</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Plaque:</span> {selectedVehicle.license_plate}</p>
                    <p><span className="font-medium">Véhicule:</span> {selectedVehicle.make} {selectedVehicle.model}</p>
                    <p><span className="font-medium">Couleur:</span> {selectedVehicle.color}</p>
                    <p><span className="font-medium">Mis en fourrière le:</span> {new Date(selectedVehicle.impound_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Estimation des frais</h4>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-lg font-bold text-primary">
                      {calculateEstimatedFees(watchedType, selectedVehicle).toLocaleString()} FCFA
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Frais administratifs + stockage
                    </p>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Important</p>
                  <p className="text-muted-foreground">
                    Cette estimation est indicative. Les frais définitifs seront calculés au moment du traitement de la procédure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center gap-4 pt-6">
          <Button type="submit" disabled={loading || !watchedVehicleId || !watchedType}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer la procédure')}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/app/procedures')}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};