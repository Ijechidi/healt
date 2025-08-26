import React from 'react';
import { Button } from '@repo/ui/components/button';
import Nav from '../navigation/Nav';
import { Heart } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`bg-background border-b ${className}`}>
      <nav className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex justify-center items-center gap-2">
              <span className="text-2xl font-bold text-primary">MedEasy </span> <Heart size={20} /> 
            </Link>
          </div>

          {/* Navigation Links */}
          <Nav className="text-card" />

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/appointment">
              <Button variant="outline" size="sm">
                Rendez-vous
              </Button>
            </Link>
            <Link href="/auth">
              <Button variant="default" size="sm">
                Connexion
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;