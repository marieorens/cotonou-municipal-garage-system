import { useState } from 'react';
import { Search, Car, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const VehicleLookupPage = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API call - replace with actual API call later
    setTimeout(() => {
      // Mock data for demonstration
      if (plateNumber.toUpperCase().includes('AA')) {
        setSearchResult({
          id: '1',
          plateNumber: plateNumber.toUpperCase(),
          brand: 'Toyota',
          model: 'Camry',
          color: 'Bleu',
          status: 'en_fourriere',
          entryDate: '2024-01-15',
          location: 'Zone A - Emplacement 15',
          fees: 75000,
          owner: {
            name: 'ADJOVI Jean',
            phone: '+229 96 12 34 56'
          }
        });
      } else {
        setSearchResult(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'en_fourriere':
        return <Badge variant="destructive">En fourrière</Badge>;
      case 'reclame':
        return <Badge variant="secondary">Réclamé</Badge>;
      case 'vendu':
        return <Badge variant="outline">Vendu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" />
            <span className="font-semibold">Consulter votre véhicule</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Consultez l'état de votre véhicule
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Entrez votre numéro d'immatriculation pour vérifier si votre véhicule se trouve en fourrière municipale
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ex: AA 1234 AB"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="text-center text-lg font-semibold uppercase"
              disabled={isLoading}
            />
            <Button type="submit" size="lg" disabled={isLoading || !plateNumber.trim()}>
              {isLoading ? (
                <>Recherche...</>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Results */}
        {hasSearched && !isLoading && (
          <div className="max-w-2xl mx-auto">
            {searchResult ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5" />
                      {searchResult.plateNumber}
                    </CardTitle>
                    {getStatusBadge(searchResult.status)}
                  </div>
                  <CardDescription>
                    {searchResult.brand} {searchResult.model} - {searchResult.color}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Date d'entrée</h4>
                      <p className="text-foreground">{new Date(searchResult.entryDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Localisation</h4>
                      <p className="text-foreground">{searchResult.location}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Frais à payer</h4>
                      <p className="text-lg font-semibold text-primary">{searchResult.fees.toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">Propriétaire</h4>
                      <p className="text-foreground">{searchResult.owner.name}</p>
                      <p className="text-sm text-muted-foreground">{searchResult.owner.phone}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">
                      Pour récupérer votre véhicule, présentez-vous à la fourrière municipale avec les documents suivants :
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Carte grise du véhicule</li>
                      <li>Pièce d'identité du propriétaire</li>
                      <li>Justificatif de paiement des frais</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Véhicule non trouvé</CardTitle>
                  <CardDescription className="text-center">
                    Aucun véhicule avec l'immatriculation "{plateNumber.toUpperCase()}" n'a été trouvé en fourrière.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Si vous pensez qu'il y a une erreur, contactez directement la fourrière municipale.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Fourrière Municipale de Cotonou</p>
                    <p className="text-sm text-muted-foreground">Tél: +229 21 30 04 00</p>
                    <p className="text-sm text-muted-foreground">Email: fourriere@mairie-cotonou.bj</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};