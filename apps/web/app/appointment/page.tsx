import AppointmentBooking from '@/components/appointment/AppointmentBooking';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prendre un rendez-vous | MedEasy',
  description: 'Réservez facilement votre rendez-vous médical en ligne avec MedEasy',
};

export default function AppointmentPage() {
  return (
    <div className="min-h-screen bg-design-bg py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Réservation de rendez-vous
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prenez rendez-vous avec nos médecins spécialisés en quelques clics. 
            Choisissez votre médecin, votre date et votre heure selon vos préférences.
          </p>
        </div>
        
        <AppointmentBooking />
      </div>
    </div>
  );
}