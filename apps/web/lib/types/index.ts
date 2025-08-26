// Core business logic types for MedEasy
export interface User {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  dateCreation: Date;
  role: UserRole;
}

export interface Patient extends User {
  patientProfile: {
    dateNaissance: Date;
    adresse?: string;
    groupeSanguin: GroupeSanguin;
    poids?: number;
    taille?: number;
    sexe: Sexe;
    documents?: Document[];
  };
}

export interface Medecin extends User {
  medecinProfile: {
    specialiteId: string;
    numLicence: string;
    anneeExperience?: number;
    titre: string;
    hopitalId?: string;
    disponibilites: Disponibilite[];
    tarif?: number;
  };
}

export interface Hopital {
  id: string;
  nom: string;
  adresse: string;
  description?: string;
  contact: string;
  localisation?: string;
  slug?: string;
  specialites: string[];
  medecins?: string[];
  services?: Service[];
}

export interface RendezVous {
  id: string;
  date: Date;
  heure: string;
  statut: StatutRendezVous;
  patientId: string;
  medecinId: string;
  hopitalId?: string;
  motif?: string;
  notes?: string;
  tarif?: number;
}

export interface Disponibilite {
  id: string;
  medecinId: string;
  jourSemaine: number; // 0-6 (Dimanche-Samedi)
  heureDebut: string;
  heureFin: string;
  isActive: boolean;
}

export interface Service {
  id: string;
  nom: string;
  description?: string;
  tarif?: number;
  dureeEstimee?: number; // en minutes
}

export interface Document {
  id: string;
  titre: string;
  description?: string;
  dateCreation: Date;
  patientId: string;
  url: string;
  type: TypeDocument;
}

// Enums
export enum UserRole {
  PATIENT = 'patient',
  MEDECIN = 'medecin',
  ADMIN = 'admin'
}

export enum StatutRendezVous {
  EN_ATTENTE = 'EN_ATTENTE',
  CONFIRME = 'CONFIRME',
  ANNULE = 'ANNULE',
  TERMINE = 'TERMINE'
}

export enum GroupeSanguin {
  A_POSITIF = 'A_POSITIF',
  A_NEGATIF = 'A_NEGATIF',
  B_POSITIF = 'B_POSITIF',
  B_NEGATIF = 'B_NEGATIF',
  AB_POSITIF = 'AB_POSITIF',
  AB_NEGATIF = 'AB_NEGATIF',
  O_POSITIF = 'O_POSITIF',
  O_NEGATIF = 'O_NEGATIF',
  INCONNU = 'INCONNU'
}

export enum Sexe {
  HOMME = 'Homme',
  FEMME = 'Femme',
  AUTRE = 'Autre'
}

export enum TypeDocument {
  ORDONNANCE = 'ORDONNANCE',
  RESULTAT_ANALYSE = 'RESULTAT_ANALYSE',
  RADIO = 'RADIO',
  AUTRE = 'AUTRE'
}

// Search and Filter types
export interface SearchFilters {
  location?: string;
  specialiteId?: string;
  hopitalName?: string;
  dateDebut?: Date;
  dateFin?: Date;
  tarifMax?: number;
}

export interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}