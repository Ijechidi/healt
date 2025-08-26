import { User, Patient, Medecin, UserRole } from '../types';

export class AuthService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  private currentUser: User | null = null;

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData: {
    nom: string;
    prenom?: string;
    email: string;
    telephone?: string;
    password: string;
    role: UserRole;
  }): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }

      const user = await response.json();
      this.currentUser = user;
      this.saveUserToStorage(user);
      
      return user;
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  }

  /**
   * Connexion utilisateur
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la connexion');
      }

      const data = await response.json();
      this.currentUser = data.user;
      this.saveUserToStorage(data.user);
      this.saveTokenToStorage(data.token);
      
      return data.user;
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  }

  /**
   * Déconnexion
   */
  logout(): void {
    this.currentUser = null;
    this.removeUserFromStorage();
    this.removeTokenFromStorage();
  }

  /**
   * Obtenir l'utilisateur connecté
   */
  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Essayer de récupérer depuis le localStorage
    const userData = this.getUserFromStorage();
    if (userData) {
      this.currentUser = userData;
      return userData;
    }

    return null;
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getTokenFromStorage() !== null;
  }

  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   */
  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Obtenir le token d'authentification
   */
  getAuthToken(): string | null {
    return this.getTokenFromStorage();
  }

  /**
   * Compléter le profil patient
   */
  async completePatientProfile(patientData: {
    dateNaissance: Date;
    adresse?: string;
    groupeSanguin: string;
    poids?: number;
    taille?: number;
    sexe: string;
  }): Promise<Patient> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await fetch(`${this.apiUrl}/patients/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          userId: user.id,
          ...patientData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du profil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur profil patient:', error);
      throw error;
    }
  }

  /**
   * Compléter le profil médecin
   */
  async completeMedecinProfile(medecinData: {
    specialiteId: string;
    numLicence: string;
    anneeExperience?: number;
    titre: string;
    hopitalId?: string;
    tarif?: number;
  }): Promise<Medecin> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await fetch(`${this.apiUrl}/medecins/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          userId: user.id,
          ...medecinData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création du profil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur profil médecin:', error);
      throw error;
    }
  }

  // Méthodes privées pour la gestion du localStorage
  private saveUserToStorage(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medeasy_user', JSON.stringify(user));
    }
  }

  private getUserFromStorage(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('medeasy_user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  private removeUserFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medeasy_user');
    }
  }

  private saveTokenToStorage(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('medeasy_token', token);
    }
  }

  private getTokenFromStorage(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('medeasy_token');
    }
    return null;
  }

  private removeTokenFromStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('medeasy_token');
    }
  }
}