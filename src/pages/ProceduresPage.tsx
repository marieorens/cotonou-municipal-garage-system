import { useState } from 'react';
import { Search, FileText, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockProcedures = [
  {
    id: '1',
    vehicleId: 'VH001',
    plateNumber: 'AA 1234 AB',
    status: 'verification_documents',
    progress: 40,
    createdAt: '2024-01-15',
    steps: [
      { name: 'Saisie véhicule', status: 'completed', date: '2024-01-15' },
      { name: 'Vérification documents', status: 'in_progress', date: null },
      { name: 'Calcul des frais', status: 'pending', date: null },
      { name: 'Génération PV', status: 'pending', date: null },
    ]
  },
  {
    id: '2',
    vehicleId: 'VH002',
    plateNumber: 'BB 5678 CD',
    status: 'calcul_frais',
    progress: 60,
    createdAt: '2024-01-14',
    steps: [
      { name: 'Saisie véhicule', status: 'completed', date: '2024-01-14' },
      { name: 'Vérification documents', status: 'completed', date: '2024-01-14' },
      { name: 'Calcul des frais', status: 'in_progress', date: null },
      { name: 'Génération PV', status: 'pending', date: null },
    ]
  }
];

export const ProceduresPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null);

  const filteredProcedures = mockProcedures.filter(procedure =>
    procedure.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    procedure.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verification_documents':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Vérification</Badge>;
      case 'calcul_frais':
        return <Badge variant="default"><FileText className="w-3 h-3 mr-1" />Calcul frais</Badge>;
      case 'generation_pv':
        return <Badge variant="outline"><Upload className="w-3 h-3 mr-1" />Génération PV</Badge>;
      case 'completed':
        return <Badge variant="secondary"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-primary" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Procédures</h1>
        <p className="text-muted-foreground">Gestion des procédures administratives</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Toutes les procédures</TabsTrigger>
          <TabsTrigger value="in-progress">En cours</TabsTrigger>
          <TabsTrigger value="completed">Terminées</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher par immatriculation ou ID véhicule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Nouvelle procédure
          </Button>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {filteredProcedures.map((procedure) => (
              <Card key={procedure.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedProcedure(procedure.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{procedure.plateNumber}</CardTitle>
                      <CardDescription>ID: {procedure.vehicleId} • Créé le {new Date(procedure.createdAt).toLocaleDateString('fr-FR')}</CardDescription>
                    </div>
                    {getStatusBadge(procedure.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progression</span>
                      <span>{procedure.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${procedure.progress}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {procedure.steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          {getStepIcon(step.status)}
                          <span className={step.status === 'completed' ? 'text-success' : 
                                        step.status === 'in_progress' ? 'text-primary' : 'text-muted-foreground'}>
                            {step.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid gap-4">
            {filteredProcedures.filter(p => p.status !== 'completed').map((procedure) => (
              <Card key={procedure.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{procedure.plateNumber}</CardTitle>
                      <CardDescription>En cours de traitement</CardDescription>
                    </div>
                    {getStatusBadge(procedure.status)}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Procédures terminées</CardTitle>
              <CardDescription>Aucune procédure terminée pour le moment</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};