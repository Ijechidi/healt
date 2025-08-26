'use client';

import React, { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Calendar, Clock, User } from 'lucide-react';

export default function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [motif, setMotif] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Simuler la réservation
    setShowSuccess(true);
    setSelectedDate('');
    setSelectedTime('');
    setMotif('');
    
    setTimeout(() => setShowSuccess(false), 5000);
  };

  // Générer les dates disponibles (prochaines 7 jours)
  const getAvailableDates = (): string[] => {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isoString = date.toISOString().split('T')[0];
      if (isoString) {
        dates.push(isoString);
      }
    }
    
    return dates;
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl shadow-lg border">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Prendre un rendez-vous</h2>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-green-800 font-medium">
            ✅ Votre rendez-vous a été réservé avec succès !
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sélection de la date */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date du rendez-vous
          </label>
          <select 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Choisir une date</option>
            {getAvailableDates().map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </option>
            ))}
          </select>
        </div>

        {/* Sélection de l'heure */}
        {selectedDate && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Heure du rendez-vous
            </label>
            <select 
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Choisir une heure</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Motif de consultation */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Motif de la consultation (optionnel)
          </label>
          <Input
            type="text"
            placeholder="Décrivez brièvement le motif de votre consultation"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Bouton de soumission */}
        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={!selectedDate || !selectedTime}
        >
          Confirmer le rendez-vous
        </Button>
      </form>

      {/* Informations complémentaires */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">
          📋 Informations importantes
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Veuillez arriver 15 minutes avant votre rendez-vous</li>
          <li>• Apportez votre carte d'identité et vos documents médicaux</li>
          <li>• En cas d'empêchement, annulez au moins 24h à l'avance</li>
          <li>• Une confirmation vous sera envoyée par SMS et email</li>
        </ul>
      </div>
    </div>
  );
}