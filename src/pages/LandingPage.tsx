import { Link } from 'react-router-dom';
import { ArrowRight, Car, Users, FileText, BarChart3, Shield, Building2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import municipalBuilding from '@/assets/cotonou-municipal-building.jpg';

const features = [
  {
    icon: Car,
    title: 'Gestion des Véhicules',
    description: 'Enregistrement, suivi et gestion complète des véhicules en fourrière avec photos et géolocalisation.',
    stats: '500+ véhicules gérés'
  },
  {
    icon: Users,
    title: 'Base de Propriétaires',
    description: 'Système centralisé de gestion des propriétaires avec historique et communications.',
    stats: '1200+ propriétaires'
  },
  {
    icon: FileText,
    title: 'Procédures Automatisées',
    description: 'Digitalisation complète des procédures administratives et génération de documents.',
    stats: '95% de dématérialisation'
  },
  {
    icon: BarChart3,
    title: 'Tableaux de Bord',
    description: 'Analytics en temps réel et rapports détaillés pour un pilotage optimal.',
    stats: 'Reporting temps réel'
  },
];

const stats = [
  { label: 'Véhicules traités', value: '2,547' },
  { label: 'Taux de récupération', value: '87%' },
  { label: 'Revenus générés', value: '125M FCFA' },
  { label: 'Délai moyen', value: '3,2 jours' },
];

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-municipal-gradient rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Fourrière Municipale</h2>
              <p className="text-xs text-muted-foreground">Mairie de Cotonou</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Connexion</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-municipal-gradient opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit">
                  🇧🇯 Mairie de Cotonou - Innovation Numérique
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Système de Gestion de la
                  <span className="bg-municipal-gradient bg-clip-text text-transparent"> Fourrière Municipale</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Solution digitale complète pour la gestion moderne et efficace des véhicules en fourrière. 
                  Streamlinez vos opérations, améliorez la transparence et optimisez les revenus municipaux.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="municipal" asChild>
                  <Link to="/vehicule-lookup">
                    <Car className="mr-2 h-5 w-5" />
                    Consulter mon véhicule
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={municipalBuilding}
                  alt="Mairie de Cotonou"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-lg font-semibold">Mairie de Cotonou</h3>
                  <p className="text-sm opacity-90">Innovation au service des citoyens</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Fonctionnalités Principales
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un écosystème complet pour moderniser la gestion de votre fourrière municipale
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-xs">
                    {feature.stats}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Votre véhicule est-il en fourrière ?
              </h2>
              <p className="text-xl text-muted-foreground">
                Vérifiez rapidement l'état de votre véhicule avec votre numéro d'immatriculation
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button size="lg" variant="municipal" asChild>
                <Link to="/vehicule-lookup">
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher mon véhicule
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-municipal-gradient rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Mairie de Cotonou</h3>
                <p className="text-sm text-muted-foreground">Service de la Fourrière Municipale</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">
                © 2024 Mairie de Cotonou. Tous droits réservés.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Développé avec ❤️ pour la ville de Cotonou
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};