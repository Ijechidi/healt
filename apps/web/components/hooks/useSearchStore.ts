import { create } from 'zustand';
import { hopitaux } from '../hopital/mockHotipal';
import { specialities } from '../spacialites/mock';
import { SearchService } from '../../lib/services/search.service';
import { SearchFilters } from '../../lib/types';

// Type compatible avec les données mock existantes
type HopitalMock = {
  id: string;
  nom: string;
  adresse: string;
  description: string;
  contact: string;
  localisation: string;
  slug: string;
  specialites: string[];
};

interface SearchState {
  location: string;
  nom: string;
  speciality: string;
  filteredHopitaux: HopitalMock[];
  searchResults: HopitalMock[];
  isLoading: boolean;
  hasActiveSearch: boolean;
  setLocation: (location: string) => void;
  setNom: (nom: string) => void;
  setSpeciality: (speciality: string) => void;
  search: () => Promise<void>;
  reset: () => void;
}

const searchService = new SearchService();

export const useSearchStore = create<SearchState>((set, get) => ({
  location: '',
  nom: '',
  speciality: '',
  filteredHopitaux: hopitaux,
  searchResults: [],
  isLoading: false,
  hasActiveSearch: false,

  setLocation: (location: string) => {
    set({ location });
    // Auto-search quand il y a un changement
    if (location.trim() || get().nom.trim() || get().speciality) {
      get().search();
    }
  },

  setNom: (nom: string) => {
    set({ nom });
    // Auto-search quand il y a un changement
    if (nom.trim() || get().location.trim() || get().speciality) {
      get().search();
    }
  },

  setSpeciality: (speciality: string) => {
    set({ speciality });
    // Auto-search quand il y a un changement
    if (speciality || get().location.trim() || get().nom.trim()) {
      get().search();
    }
  },

  search: async () => {
    const { location, nom, speciality } = get();
    
    // Si aucun filtre n'est actif, réinitialiser
    if (!location.trim() && !nom.trim() && !speciality) {
      set({ 
        filteredHopitaux: hopitaux, 
        searchResults: [],
        hasActiveSearch: false,
        isLoading: false 
      });
      return;
    }

    set({ isLoading: true, hasActiveSearch: true });

    try {
      const filters: SearchFilters = {
        location: location.trim() || undefined,
        hopitalName: nom.trim() || undefined,
        specialiteId: speciality || undefined
      };

      // Fallback vers le filtrage local pour le moment
      let filtered = [...hopitaux];

      if (location.trim()) {
        filtered = filtered.filter(h => 
          h.localisation?.toLowerCase().includes(location.toLowerCase()) ||
          h.adresse.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (nom.trim()) {
        filtered = filtered.filter(h => 
          h.nom.toLowerCase().includes(nom.toLowerCase())
        );
      }

      if (speciality) {
        filtered = filtered.filter(h => 
          h.specialites.includes(speciality)
        );
      }

      set({ 
        filteredHopitaux: filtered,
        searchResults: filtered,
        isLoading: false 
      });

      console.log('État de la recherche:', { location, nom, speciality, hasActiveSearch: true });
      console.log('Hôpitaux filtrés:', filtered);
      
    } catch (error) {
      console.error('Erreur de recherche:', error);
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({
      location: '',
      nom: '',
      speciality: '',
      filteredHopitaux: hopitaux,
      searchResults: [],
      hasActiveSearch: false,
      isLoading: false
    });
  }
})); 