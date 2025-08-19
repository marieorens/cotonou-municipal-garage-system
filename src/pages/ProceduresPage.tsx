import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Upload, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Procedure } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const ProceduresPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        setLoading(true);
        const { data: proceduresData, error } = await supabase
          .from('procedures')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setProcedures((proceduresData || []).map(p => ({ ...p, documents: [] } as Procedure)));
      } catch (error) {
        console.error('Erreur lors du chargement des procédures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, []);

  const filteredProcedures = procedures.filter(procedure =>
    procedure.vehicle_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    procedure.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'in_progress':
        return <Badge variant="default"><FileText className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-success-light text-success"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Annulé</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'release':
        return 'Libération';
      case 'sale':
        return 'Vente';
      case 'destruction':
        return 'Destruction';
      default:
        return type;
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case 'pending':
        return 20;
      case 'in_progress':
        return 60;
      case 'completed':
        return 100;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} FCFA`;
  };

  const inProgressCount = procedures.filter(p => p.status === 'in_progress').length;
  const completedCount = procedures.filter(p => p.status === 'completed').length;
  const pendingCount = procedures.filter(p => p.status === 'pending').length;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Procédures</h1>
        <p className="text-muted-foreground">Gestion des procédures administratives</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total procédures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procedures.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En attente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{inProgressCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Terminées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedCount}</div>
          </CardContent>
        </Card>
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
              placeholder="Rechercher par ID procédure ou véhicule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {(user?.role === 'admin' || user?.role === 'agent') && (
            <Button
              onClick={() => navigate('/app/procedures/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle procédure
            </Button>
          )}
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {loading ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">Chargement des procédures...</p>
                </CardContent>
              </Card>
            ) : filteredProcedures.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">Aucune procédure trouvée</p>
                </CardContent>
              </Card>
            ) : (
              filteredProcedures.map((procedure) => (
                <Card key={procedure.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/app/procedures/${procedure.id}`)}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Procédure #{procedure.id}</CardTitle>
                        <CardDescription>
                          Véhicule ID: {procedure.vehicle_id} • Type: {getTypeLabel(procedure.type)} • 
                          Créé le {new Date(procedure.created_at).toLocaleDateString('fr-FR')}
                        </CardDescription>
                      </div>
                      {getStatusBadge(procedure.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Frais calculés:</span>
                          <p className="font-medium">{formatCurrency(procedure.fees_calculated)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Documents:</span>
                          <p className="font-medium">{procedure.documents.length} document(s)</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid gap-4">
            {filteredProcedures.filter(p => p.status === 'in_progress').map((procedure) => (
              <Card key={procedure.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Procédure #{procedure.id}</CardTitle>
                      <CardDescription>En cours de traitement</CardDescription>
                    </div>
                    {getStatusBadge(procedure.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Frais calculés:</span>
                      <p className="font-medium">{formatCurrency(procedure.fees_calculated)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Documents:</span>
                      <p className="font-medium">{procedure.documents.length} document(s)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {filteredProcedures.filter(p => p.status === 'completed').length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Procédures terminées</CardTitle>
                  <CardDescription>Aucune procédure terminée pour le moment</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              filteredProcedures.filter(p => p.status === 'completed').map((procedure) => (
                <Card key={procedure.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Procédure #{procedure.id}</CardTitle>
                        <CardDescription>Terminée le {new Date(procedure.updated_at).toLocaleDateString('fr-FR')}</CardDescription>
                      </div>
                      {getStatusBadge(procedure.status)}
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};