import { Hopital, Medecin, SearchFilters, SearchResult } from '../types';

export class SearchService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  /**
   * Rechercher des hôpitaux
   */
  async searchHopitaux(filters: SearchFilters): Promise<SearchResult<Hopital>> {
    try {
      const searchParams = new URLSearchParams();
      
      if (filters.location) {
        searchParams.append('location', filters.location);
      }
      if (filters.specialiteId) {
        searchParams.append('specialiteId', filters.specialiteId);
      }
      if (filters.hopitalName) {
        searchParams.append('nom', filters.hopitalName);
      }

      const response = await fetch(`${this.apiUrl}/hopitaux/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche des hôpitaux');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur recherche hôpitaux:', error);
      // Fallback vers les données mock en cas d'erreur
      return this.getMockHopitauxResults(filters);
    }
  }

  /**
   * Rechercher des médecins
   */
  async searchMedecins(filters: SearchFilters): Promise<SearchResult<Medecin>> {
    try {
      const searchParams = new URLSearchParams();
      
      if (filters.location) {
        searchParams.append('location', filters.location);
      }
      if (filters.specialiteId) {
        searchParams.append('specialiteId', filters.specialiteId);
      }
      if (filters.tarifMax) {
        searchParams.append('tarifMax', filters.tarifMax.toString());
      }

      const response = await fetch(`${this.apiUrl}/medecins/search?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche des médecins');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur recherche médecins:', error);
      // Fallback vers les données mock en cas d'erreur
      return this.getMockMedecinsResults(filters);
    }
  }

  /**
   * Recherche avancée (médecins et hôpitaux)
   */
  async searchAdvanced(filters: SearchFilters): Promise<{
    hopitaux: SearchResult<Hopital>;
    medecins: SearchResult<Medecin>;
  }> {
    try {
      const [hopitauxResults, medecinsResults] = await Promise.all([
        this.searchHopitaux(filters),
        this.searchMedecins(filters),
      ]);

      return {
        hopitaux: hopitauxResults,
        medecins: medecinsResults,
      };
    } catch (error) {
      console.error('Erreur recherche avancée:', error);
      throw error;
    }
  }

  /**
   * Obtenir les suggestions de recherche
   */
  async getSuggestions(query: string, type: 'hopital' | 'medecin' | 'all' = 'all'): Promise<{
    hopitaux: string[];
    medecins: string[];
    specialites: string[];
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/search/suggestions?q=${encodeURIComponent(query)}&type=${type}`);
      
      if (!response.ok) {
        return { hopitaux: [], medecins: [], specialites: [] };
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur suggestions:', error);
      return { hopitaux: [], medecins: [], specialites: [] };
    }
  }

  // Méthodes privées pour les données mock
  private getMockHopitauxResults(filters: SearchFilters): SearchResult<Hopital> {
    // Import des données mock existantes
    const { hopitaux } = require('../../components/hopital/mockHotipal');
    
    let filteredHopitaux = [...hopitaux];

    // Filtrage par localisation
    if (filters.location) {
      filteredHopitaux = filteredHopitaux.filter(h => 
        h.localisation?.toLowerCase().includes(filters.location!.toLowerCase()) ||
        h.adresse.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Filtrage par nom d'hôpital
    if (filters.hopitalName) {
      filteredHopitaux = filteredHopitaux.filter(h => 
        h.nom.toLowerCase().includes(filters.hopitalName!.toLowerCase())
      );
    }

    // Filtrage par spécialité
    if (filters.specialiteId) {
      filteredHopitaux = filteredHopitaux.filter(h => 
        h.specialites.includes(filters.specialiteId!)
      );
    }

    return {
      data: filteredHopitaux,
      total: filteredHopitaux.length,
      page: 1,
      limit: 20
    };
  }

  private getMockMedecinsResults(filters: SearchFilters): SearchResult<Medecin> {
    // Données mock pour les médecins
    const mockMedecins: Medecin[] = [
      {
        id: '1',
        nom: 'Dr. AMEGAH',
        prenom: 'Jean',
        email: 'j.amegah@medecin.tg',
        telephone: '+228 90 12 34 56',
        dateCreation: new Date(),
        role: 'medecin' as any,
        medecinProfile: {
          specialiteId: '1',
          numLicence: 'TG001234',
          anneeExperience: 10,
          titre: 'Neurologue',
          hopitalId: '1',
          disponibilites: [],
          tarif: 15000
        }
      },
      {
        id: '2',
        nom: 'Dr. KOFFI',
        prenom: 'Marie',
        email: 'm.koffi@medecin.tg',
        telephone: '+228 90 23 45 67',
        dateCreation: new Date(),
        role: 'medecin' as any,
        medecinProfile: {
          specialiteId: '2',
          numLicence: 'TG001235',
          anneeExperience: 8,
          titre: 'Cardiologue',
          hopitalId: '2',
          disponibilites: [],
          tarif: 20000
        }
      }
    ];

    let filteredMedecins = [...mockMedecins];

    // Filtrage par spécialité
    if (filters.specialiteId) {
      filteredMedecins = filteredMedecins.filter(m => 
        m.medecinProfile.specialiteId === filters.specialiteId
      );
    }

    // Filtrage par tarif maximum
    if (filters.tarifMax) {
      filteredMedecins = filteredMedecins.filter(m => 
        (m.medecinProfile.tarif || 0) <= filters.tarifMax!
      );
    }

    return {
      data: filteredMedecins,
      total: filteredMedecins.length,
      page: 1,
      limit: 20
    };
  }
}