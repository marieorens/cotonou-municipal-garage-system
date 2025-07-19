import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Vehicle, VehicleType, VehicleStatus } from '@/types';

interface VehicleFormData {
  license_plate: string;
  make: string;
  model: string;
  color: string;
  year: number;
  type: VehicleType;
  estimated_value: number;
  location: string;
  description?: string;
  photos: File[];
}

const initialFormData: VehicleFormData = {
  license_plate: '',
  make: '',
  model: '',
  color: '',
  year: new Date().getFullYear(),
  type: 'car',
  estimated_value: 0,
  location: '',
  description: '',
  photos: [],
};

export const VehicleFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photosPreviews, setPhotosPreviews] = useState<string[]>([]);

  const handleInputChange = (field: keyof VehicleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length > 10) {
      toast({
        title: 'Limite atteinte',
        description: 'Vous ne pouvez télécharger que 10 photos maximum.',
        variant: 'destructive',
      });
      return;
    }

    // Add new photos
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotosPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
    setPhotosPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here we would submit to the API
      console.log('Submitting vehicle:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: isEdit ? 'Véhicule modifié' : 'Véhicule enregistré',
        description: `Le véhicule ${formData.license_plate} a été ${isEdit ? 'modifié' : 'enregistré'} avec succès.`,
      });
      
      navigate('/vehicules');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value.replace(/[^\d]/g, ''));
    return isNaN(numValue) ? '' : numValue.toLocaleString('fr-FR');
  };

  const handleValueChange = (value: string) => {
    const numValue = parseFloat(value.replace(/[^\d]/g, ''));
    handleInputChange('estimated_value', isNaN(numValue) ? 0 : numValue);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/vehicules')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? 'Modifier le véhicule' : 'Nouveau véhicule'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Modifier les informations du véhicule' : 'Enregistrer un nouveau véhicule en fourrière'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du véhicule</CardTitle>
            <CardDescription>
              Saisir les détails d'identification du véhicule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="license_plate">Plaque d'immatriculation *</Label>
                <Input
                  id="license_plate"
                  placeholder="AB-123-CD"
                  value={formData.license_plate}
                  onChange={(e) => handleInputChange('license_plate', e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de véhicule *</Label>
                <Select value={formData.type} onValueChange={(value: VehicleType) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Voiture</SelectItem>
                    <SelectItem value="motorcycle">Moto</SelectItem>
                    <SelectItem value="truck">Camion</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="make">Marque *</Label>
                <Input
                  id="make"
                  placeholder="Toyota, Honda, etc."
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modèle *</Label>
                <Input
                  id="model"
                  placeholder="Corolla, Civic, etc."
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Couleur *</Label>
                <Input
                  id="color"
                  placeholder="Blanc, Noir, Rouge, etc."
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Année *</Label>
                <Input
                  id="year"
                  type="number"
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localisation en fourrière *</Label>
                <Input
                  id="location"
                  placeholder="Zone A-12, Zone B-08, etc."
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_value">Valeur estimée (FCFA) *</Label>
                <Input
                  id="estimated_value"
                  placeholder="5,000,000"
                  value={formatCurrency(formData.estimated_value.toString())}
                  onChange={(e) => handleValueChange(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                placeholder="État du véhicule, dommages observés, etc."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photos du véhicule
            </CardTitle>
            <CardDescription>
              Télécharger jusqu'à 10 photos du véhicule (recommandé: vues avant, arrière, latérales, et dommages)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <input
                type="file"
                id="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <label htmlFor="photos" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm font-medium">Cliquer pour télécharger des photos</p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF jusqu'à 5MB par fichier
                  </p>
                </div>
              </label>
            </div>

            {photosPreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photosPreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/vehicules')}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-municipal-gradient hover:opacity-90"
          >
            {isSubmitting ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Enregistrer')}
          </Button>
        </div>
      </form>
    </div>
  );
};