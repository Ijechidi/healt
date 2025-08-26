import AuthForm from '@/components/auth/AuthForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion | MedEasy',
  description: 'Connectez-vous à votre compte MedEasy pour gérer vos rendez-vous médicaux',
};

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-design-bg py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}