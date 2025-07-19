import { useState } from 'react';
import { Send, MessageSquare, Mail, Smartphone, Bell, Users, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockNotifications = [
  {
    id: 'NOT001',
    type: 'sms',
    recipient: 'ADJOVI Jean',
    phone: '+229 96 12 34 56',
    message: 'Votre véhicule AA 1234 AB est en fourrière. Délai légal: 15 jours.',
    status: 'sent',
    sentAt: '2024-01-15T10:30:00',
    vehicleId: 'VH001'
  },
  {
    id: 'NOT002',
    type: 'email',
    recipient: 'KOSSOU Marie',
    email: 'marie.kossou@email.com',
    message: 'Rappel: Votre véhicule BB 5678 CD doit être récupéré sous 3 jours.',
    status: 'pending',
    sentAt: null,
    vehicleId: 'VH002'
  },
  {
    id: 'NOT003',
    type: 'sms',
    recipient: 'TOGBE Paul',
    phone: '+229 97 65 43 21',
    message: 'Fin de délai légal pour votre véhicule CC 9012 EF. Procédure de vente engagée.',
    status: 'failed',
    sentAt: '2024-01-14T15:45:00',
    vehicleId: 'VH003'
  }
];

const notificationTemplates = [
  {
    id: 'entry',
    name: 'Mise en fourrière',
    subject: 'Véhicule mis en fourrière',
    content: 'Votre véhicule {plateNumber} a été mis en fourrière le {date}. Vous disposez de 15 jours pour le récupérer.'
  },
  {
    id: 'reminder',
    name: 'Rappel délai',
    subject: 'Rappel - Véhicule en fourrière',
    content: 'Rappel: Il vous reste {remainingDays} jours pour récupérer votre véhicule {plateNumber}.'
  },
  {
    id: 'final_notice',
    name: 'Dernier avis',
    subject: 'Dernier avis - Procédure de vente',
    content: 'Dernier avis: Votre véhicule {plateNumber} sera vendu aux enchères si vous ne le récupérez pas sous 48h.'
  }
];

export const NotificationsPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [notificationType, setNotificationType] = useState('sms');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Envoyé</Badge>;
      case 'pending':
        return <Badge variant="default">En attente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échec</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sms':
        return <Smartphone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const sentCount = mockNotifications.filter(n => n.status === 'sent').length;
  const pendingCount = mockNotifications.filter(n => n.status === 'pending').length;
  const failedCount = mockNotifications.filter(n => n.status === 'failed').length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Gestion des communications avec les propriétaires</p>
      </div>

      <Tabs defaultValue="send" className="space-y-6">
        <TabsList>
          <TabsTrigger value="send">Envoyer</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
        </TabsList>

        {/* Send Notifications Tab */}
        <TabsContent value="send" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Nouvelle notification</CardTitle>
                <CardDescription>Envoyer un message aux propriétaires</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Type de notification</label>
                  <Select value={notificationType} onValueChange={setNotificationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="both">SMS + Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Modèle prédéfini</label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message personnalisé</label>
                  <Textarea
                    placeholder="Tapez votre message ici..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Destinataires</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner les destinataires" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les propriétaires</SelectItem>
                      <SelectItem value="overdue">Délai dépassé</SelectItem>
                      <SelectItem value="expiring">Délai proche</SelectItem>
                      <SelectItem value="specific">Sélection spécifique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer notification
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aperçu du message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(notificationType)}
                    <span className="text-sm font-medium capitalize">{notificationType}</span>
                  </div>
                  <div className="text-sm">
                    {selectedTemplate ? 
                      notificationTemplates.find(t => t.id === selectedTemplate)?.content || customMessage :
                      customMessage || "Votre message apparaîtra ici..."
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total envoyés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockNotifications.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Envoyés avec succès</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{sentCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>En attente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Échecs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{failedCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications Table */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Destinataire</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell className="font-medium">{notification.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(notification.type)}
                          <span className="capitalize">{notification.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{notification.recipient}</div>
                          <div className="text-sm text-muted-foreground">
                            {notification.phone || notification.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{notification.message}</TableCell>
                      <TableCell>{getStatusBadge(notification.status)}</TableCell>
                      <TableCell>
                        {notification.sentAt ? 
                          new Date(notification.sentAt).toLocaleDateString('fr-FR') : 
                          '-'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-4">
            {notificationTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>{template.subject}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    {template.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};