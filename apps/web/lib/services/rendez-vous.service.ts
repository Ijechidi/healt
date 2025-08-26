import { RendezVous, StatutRendezVous, Disponibilite, Medecin } from '../types';

export class RendezVousService {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  /**
   * Réserver un rendez-vous
   */
  async reserverRendezVous(rendezVousData: {
    patientId: string;
    medecinId: string;
    date: Date;
    heure: string;
    motif?: string;
  }): Promise<RendezVous> {
    try {
      // Vérifier la disponibilité du médecin
      const disponible = await this.verifierDisponibilite(
        rendezVousData.medecinId,
        rendezVousData.date,
        rendezVousData.heure
      );

      if (!disponible) {
        throw new Error('Ce créneau n\'est pas disponible');
      }

      const response = await fetch(`${this.apiUrl}/rendez-vous`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...rendezVousData,
          statut: StatutRendezVous.EN_ATTENTE,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réservation');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur réservation:', error);
      throw error;
    }
  }

  /**
   * Vérifier la disponibilité d'un médecin
   */
  async verifierDisponibilite(
    medecinId: string,
    date: Date,
    heure: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.apiUrl}/medecins/${medecinId}/disponibilite?date=${date.toISOString()}&heure=${heure}`
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.disponible;
    } catch (error) {
      console.error('Erreur vérification disponibilité:', error);
      return false;
    }
  }

  /**
   * Obtenir les créneaux disponibles d'un médecin pour une date
   */
  async getCreneauxDisponibles(
    medecinId: string,
    date: Date
  ): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/medecins/${medecinId}/creneaux?date=${date.toISOString()}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.creneaux;
    } catch (error) {
      console.error('Erreur récupération créneaux:', error);
      return [];
    }
  }

  /**
   * Annuler un rendez-vous
   */
  async annulerRendezVous(rendezVousId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/rendez-vous/${rendezVousId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statut: StatutRendezVous.ANNULE,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur annulation:', error);
      return false;
    }
  }

  /**
   * Confirmer un rendez-vous
   */
  async confirmerRendezVous(rendezVousId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/rendez-vous/${rendezVousId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statut: StatutRendezVous.CONFIRME,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur confirmation:', error);
      return false;
    }
  }

  /**
   * Obtenir les rendez-vous d'un patient
   */
  async getRendezVousPatient(patientId: string): Promise<RendezVous[]> {
    try {
      const response = await fetch(`${this.apiUrl}/patients/${patientId}/rendez-vous`);
      
      if (!response.ok) {
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération rendez-vous patient:', error);
      return [];
    }
  }

  /**
   * Obtenir les rendez-vous d'un médecin
   */
  async getRendezVousMedecin(medecinId: string): Promise<RendezVous[]> {
    try {
      const response = await fetch(`${this.apiUrl}/medecins/${medecinId}/rendez-vous`);
      
      if (!response.ok) {
        return [];
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération rendez-vous médecin:', error);
      return [];
    }
  }
}