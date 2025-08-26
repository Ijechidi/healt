import { create } from 'zustand';
import { RendezVous, StatutRendezVous } from '../types';
import { RendezVousService } from '../services/rendez-vous.service';

interface AppointmentState {
  rendezVous: RendezVous[];
  currentAppointment: RendezVous | null;
  availableSlots: string[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setRendezVous: (rendezVous: RendezVous[]) => void;
  setCurrentAppointment: (appointment: RendezVous | null) => void;
  setAvailableSlots: (slots: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Business logic methods
  reserverRendezVous: (appointmentData: {
    patientId: string;
    medecinId: string;
    date: Date;
    heure: string;
    motif?: string;
  }) => Promise<RendezVous>;
  
  annulerRendezVous: (rendezVousId: string) => Promise<boolean>;
  confirmerRendezVous: (rendezVousId: string) => Promise<boolean>;
  loadCreneauxDisponibles: (medecinId: string, date: Date) => Promise<void>;
  loadRendezVousPatient: (patientId: string) => Promise<void>;
  loadRendezVousMedecin: (medecinId: string) => Promise<void>;
}

const rendezVousService = new RendezVousService();

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  rendezVous: [],
  currentAppointment: null,
  availableSlots: [],
  isLoading: false,
  error: null,

  setRendezVous: (rendezVous) => set({ rendezVous }),
  setCurrentAppointment: (appointment) => set({ currentAppointment: appointment }),
  setAvailableSlots: (slots) => set({ availableSlots: slots }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  reserverRendezVous: async (appointmentData) => {
    set({ isLoading: true, error: null });
    
    try {
      const newAppointment = await rendezVousService.reserverRendezVous(appointmentData);
      
      // Ajouter le nouveau rendez-vous à la liste
      const currentRendezVous = get().rendezVous;
      set({ 
        rendezVous: [...currentRendezVous, newAppointment],
        currentAppointment: newAppointment,
        isLoading: false 
      });
      
      return newAppointment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la réservation';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  annulerRendezVous: async (rendezVousId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const success = await rendezVousService.annulerRendezVous(rendezVousId);
      
      if (success) {
        // Mettre à jour le statut dans la liste locale
        const currentRendezVous = get().rendezVous;
        const updatedRendezVous = currentRendezVous.map(rdv => 
          rdv.id === rendezVousId 
            ? { ...rdv, statut: StatutRendezVous.ANNULE }
            : rdv
        );
        
        set({ rendezVous: updatedRendezVous, isLoading: false });
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'annulation';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  confirmerRendezVous: async (rendezVousId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const success = await rendezVousService.confirmerRendezVous(rendezVousId);
      
      if (success) {
        // Mettre à jour le statut dans la liste locale
        const currentRendezVous = get().rendezVous;
        const updatedRendezVous = currentRendezVous.map(rdv => 
          rdv.id === rendezVousId 
            ? { ...rdv, statut: StatutRendezVous.CONFIRME }
            : rdv
        );
        
        set({ rendezVous: updatedRendezVous, isLoading: false });
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la confirmation';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  loadCreneauxDisponibles: async (medecinId: string, date: Date) => {
    set({ isLoading: true, error: null });
    
    try {
      const slots = await rendezVousService.getCreneauxDisponibles(medecinId, date);
      set({ availableSlots: slots, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des créneaux';
      set({ error: errorMessage, isLoading: false });
    }
  },

  loadRendezVousPatient: async (patientId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const rendezVous = await rendezVousService.getRendezVousPatient(patientId);
      set({ rendezVous, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des rendez-vous';
      set({ error: errorMessage, isLoading: false });
    }
  },

  loadRendezVousMedecin: async (medecinId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const rendezVous = await rendezVousService.getRendezVousMedecin(medecinId);
      set({ rendezVous, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des rendez-vous';
      set({ error: errorMessage, isLoading: false });
    }
  },
}));