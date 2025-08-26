'use client';

import React, { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { User, Mail, Lock } from 'lucide-react';

interface AuthFormProps {
  onSuccess?: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthForm({ onSuccess, defaultMode = 'login' }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simuler la connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Connexion réussie !');
      onSuccess?.();
    } catch (error) {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    try {
      // Simuler l'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      setMode('login');
      setFormData({
        nom: '',
        email: formData.email,
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setError('Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-xl shadow-lg border">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <User className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Connexion' : 'Inscription'}
          </h2>
        </div>
        <p className="text-muted-foreground">
          {mode === 'login' 
            ? 'Connectez-vous à votre compte MedEasy'
            : 'Créez votre compte MedEasy'
          }
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-800 text-sm">❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg">
          <p className="text-green-800 text-sm">✅ {success}</p>
        </div>
      )}

      <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
        {mode === 'register' && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Nom *
            </label>
            <Input
              type="text"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email *
          </label>
          <Input
            type="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Mot de passe *
          </label>
          <Input
            type="password"
            placeholder="Votre mot de passe"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
          />
        </div>

        {mode === 'register' && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Confirmer le mot de passe *
            </label>
            <Input
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
            />
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading 
            ? (mode === 'login' ? 'Connexion...' : 'Inscription...')
            : (mode === 'login' ? 'Se connecter' : 'S\'inscrire')
          }
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
        </p>
        <Button
          variant="link"
          size="sm"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login');
            setError(null);
            setSuccess(null);
          }}
          className="mt-1"
        >
          {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
        </Button>
      </div>
    </div>
  );
}