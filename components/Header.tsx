import React from 'react';
import { BrainCircuitIcon, GithubIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <BrainCircuitIcon className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white">
              Hybrido
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <p className="hidden md:block text-sm text-gray-400">Votre assistant IA pour une pédagogie multimodale</p>
            <a href="https://github.com/lanneyre/Hybrido" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <GithubIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;