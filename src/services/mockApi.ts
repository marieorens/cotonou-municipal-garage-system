// Mock API service for development - simulates backend responses
import { User, LoginCredentials, AuthResponse, Vehicle, Owner, Payment, Procedure, Notification, DashboardStats } from '@/types';

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrateur Principal',
    email: 'admin@cotonou.bj',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Agent de Fourrière',
    email: 'agent@cotonou.bj',
    role: 'agent',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Responsable Finance',
    email: 'finance@cotonou.bj',
    role: 'finance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock passwords (in real app, these would be hashed)
const mockPasswords: Record<string, string> = {
  'admin@cotonou.bj': 'admin123',
  'agent@cotonou.bj': 'agent123',
  'finance@cotonou.bj': 'finance123',
};

// Mock vehicles database
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    license_plate: 'AA-123-BC',
    make: 'Toyota',
    model: 'Corolla',
    color: 'Blanc',
    year: 2018,
    type: 'car',
    status: 'impounded',
    impound_date: '2024-01-15T10:30:00Z',
    location: 'Zone A - Emplacement 15',
    photos: [],
    estimated_value: 2500000,
    description: 'Véhicule stationné en zone interdite',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    license_plate: 'BB-456-DE',
    make: 'Honda',
    model: 'Civic',
    color: 'Rouge',
    year: 2020,
    type: 'car',
    status: 'claimed',
    impound_date: '2024-01-10T14:00:00Z',
    location: 'Zone B - Emplacement 8',
    photos: [],
    estimated_value: 3200000,
    description: 'Stationnement gênant sur voie publique',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock owners database
const mockOwners: Owner[] = [
  {
    id: '1',
    first_name: 'Jean',
    last_name: 'Dupont',
    phone: '+229 97 12 34 56',
    email: 'jean.dupont@email.com',
    address: 'Quartier Akpakpa, Rue 123',
    id_number: 'CNI123456789',
    id_type: 'cni',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    first_name: 'Marie',
    last_name: 'Koffi',
    phone: '+229 96 98 76 54',
    email: 'marie.koffi@email.com',
    address: 'Quartier Cadjehoun, Avenue de la Paix',
    id_number: 'CNI987654321',
    id_type: 'cni',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  private static getStoredUser(): User | null {
    const userStr = sessionStorage.getItem('demo_current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private static getStoredToken(): string | null {
    return sessionStorage.getItem('demo_auth_token');
  }

  // Authentication
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(800); // Simulate network delay

    const user = mockUsers.find(u => u.email === credentials.email);
    const password = mockPasswords[credentials.email];

    if (!user || password !== credentials.password) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = `mock_token_${Date.now()}_${user.id}`;
    
    // Store in session storage
    sessionStorage.setItem('demo_current_user', JSON.stringify(user));
    sessionStorage.setItem('demo_auth_token', token);

    return {
      user,
      token,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
    };
  }

  static async logout(): Promise<void> {
    await delay(300);
    sessionStorage.removeItem('demo_current_user');
    sessionStorage.removeItem('demo_auth_token');
  }

  static async getProfile(): Promise<{ user: User }> {
    await delay(400);
    
    const user = this.getStoredUser();
    const token = this.getStoredToken();
    
    if (!user || !token) {
      throw new Error('Non authentifié');
    }

    return { user };
  }

  // Vehicles
  static async getVehicles(filters?: any): Promise<{ vehicles: Vehicle[] }> {
    await delay(600);
    return { vehicles: mockVehicles };
  }

  static async getVehicle(id: string): Promise<{ vehicle: Vehicle; owner: Owner }> {
    await delay(400);
    const vehicle = mockVehicles.find(v => v.id === id);
    if (!vehicle) {
      throw new Error('Véhicule non trouvé');
    }
    // Find owner by linking vehicle to first available owner (demo purposes)
    const owner = mockOwners[0]; // Simple demo logic
    return { vehicle, owner };
  }

  static async searchVehicleByPlate(plate: string): Promise<{ vehicle: Vehicle; owner: Owner } | null> {
    await delay(500);
    const vehicle = mockVehicles.find(v => 
      v.license_plate.toLowerCase().replace(/[-\s]/g, '') === 
      plate.toLowerCase().replace(/[-\s]/g, '')
    );
    if (!vehicle) {
      return null;
    }
    const owner = mockOwners[0]; // Simple demo logic
    return { vehicle, owner };
  }

  static async createVehicle(vehicleData: Partial<Vehicle>): Promise<{ vehicle: Vehicle }> {
    await delay(600);
    const newVehicle: Vehicle = {
      id: (mockVehicles.length + 1).toString(),
      license_plate: vehicleData.license_plate || '',
      make: vehicleData.make || '',
      model: vehicleData.model || '',
      color: vehicleData.color || '',
      year: vehicleData.year || new Date().getFullYear(),
      type: vehicleData.type || 'car',
      status: vehicleData.status || 'impounded',
      impound_date: vehicleData.impound_date || new Date().toISOString(),
      location: vehicleData.location || 'Zone A - Emplacement TBD',
      photos: [],
      estimated_value: vehicleData.estimated_value || 0,
      description: vehicleData.description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockVehicles.push(newVehicle);
    return { vehicle: newVehicle };
  }

  static async updateVehicle(id: string, vehicleData: Partial<Vehicle>): Promise<{ vehicle: Vehicle }> {
    await delay(600);
    const index = mockVehicles.findIndex(v => v.id === id);
    if (index === -1) {
      throw new Error('Véhicule non trouvé');
    }
    const updatedVehicle = { ...mockVehicles[index], ...vehicleData, updated_at: new Date().toISOString() };
    mockVehicles[index] = updatedVehicle;
    return { vehicle: updatedVehicle };
  }

  // Owners
  static async getOwners(): Promise<{ owners: Owner[] }> {
    await delay(500);
    return { owners: mockOwners };
  }

  static async getOwner(id: string): Promise<{ owner: Owner }> {
    await delay(400);
    const owner = mockOwners.find(o => o.id === id);
    if (!owner) {
      throw new Error('Propriétaire non trouvé');
    }
    return { owner };
  }

  // Dashboard stats
  static async getDashboardStats(): Promise<DashboardStats> {
    await delay(700);
    return {
      total_vehicles: mockVehicles.length,
      vehicles_by_status: {
        impounded: 1,
        claimed: 1,
        sold: 0,
        destroyed: 0,
        pending_destruction: 0,
      },
      monthly_revenue: 450000,
      recent_payments: [],
      pending_procedures: 3,
    };
  }

  // Mock procedures database
  static mockProcedures: Procedure[] = [
    {
      id: '1',
      vehicle_id: '1',
      type: 'release',
      status: 'pending',
      documents: [
        {
          id: '1',
          name: 'Carte grise',
          type: 'pdf',
          url: '/documents/carte_grise_1.pdf',
          uploaded_at: new Date().toISOString()
        }
      ],
      fees_calculated: 45000,
      created_by: '1',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      vehicle_id: '2',
      type: 'sale',
      status: 'in_progress',
      documents: [],
      fees_calculated: 125000,
      created_by: '1',
      created_at: '2024-01-14T14:20:00Z',
      updated_at: '2024-01-14T14:20:00Z',
    }
  ];

  // Procedures with mock data
  static async getProcedures(): Promise<Procedure[]> {
    await delay(500);
    return this.mockProcedures;
  }

  static async createProcedure(procedureData: Omit<Procedure, 'id' | 'created_at' | 'updated_at'>): Promise<{ procedure: Procedure }> {
    await delay(600);
    const newProcedure: Procedure = {
      id: (this.mockProcedures.length + 1).toString(),
      ...procedureData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.mockProcedures.push(newProcedure);
    return { procedure: newProcedure };
  }

  // Payments with mock data
  static async getPayments(): Promise<Payment[]> {
    await delay(500);
    return [
      {
        id: '1',
        vehicle_id: '1',
        owner_id: '1',
        amount: 45000,
        payment_method: 'cash',
        payment_date: '2024-01-15T14:30:00Z',
        reference: 'PAY-2024-001',
        description: 'Frais de fourrière - Toyota Corolla AA-123-BC',
        created_at: '2024-01-15T14:30:00Z',
        updated_at: '2024-01-15T14:30:00Z',
      },
      {
        id: '2',
        vehicle_id: '2',
        owner_id: '2',
        amount: 32000,
        payment_method: 'mobile_money',
        payment_date: '2024-01-14T16:45:00Z',
        reference: 'PAY-2024-002',
        description: 'Frais de fourrière - Honda Civic BB-456-DE',
        created_at: '2024-01-14T16:45:00Z',
        updated_at: '2024-01-14T16:45:00Z',
      },
      {
        id: '3',
        vehicle_id: '1',
        owner_id: '1',
        amount: 125000,
        payment_method: 'bank_transfer',
        payment_date: '2024-01-13T11:15:00Z',
        reference: 'PAY-2024-003',
        description: 'Amende et frais de procédure',
        created_at: '2024-01-13T11:15:00Z',
        updated_at: '2024-01-13T11:15:00Z',
      }
    ];
  }

  // Notifications with mock data
  static async getNotifications(): Promise<Notification[]> {
    await delay(500);
    return [
      {
        id: '1',
        recipient: '+229 97 12 34 56',
        type: 'impound_notice',
        channel: 'sms',
        message: 'Votre véhicule AA-123-BC a été mis en fourrière. Contactez-nous au 21 30 04 00.',
        sent_at: '2024-01-15T10:45:00Z',
        status: 'sent',
      },
      {
        id: '2',
        recipient: 'jean.dupont@email.com',
        type: 'deadline_warning',
        channel: 'email',
        message: 'Dernier rappel: votre véhicule sera vendu dans 48h si les frais ne sont pas réglés.',
        sent_at: '2024-01-14T09:00:00Z',
        status: 'sent',
      },
      {
        id: '3',
        recipient: '+229 96 98 76 54',
        type: 'payment_reminder',
        channel: 'sms',
        message: 'Rappel: frais de fourrière impayés pour le véhicule BB-456-DE.',
        sent_at: '2024-01-13T15:30:00Z',
        status: 'failed',
      }
    ];
  }

  // Users (admin only)
  static async getUsers(): Promise<{ users: User[] }> {
    await delay(500);
    const currentUser = this.getStoredUser();
    if (currentUser?.role !== 'admin') {
      throw new Error('Accès non autorisé');
    }
    return { users: mockUsers };
  }
}