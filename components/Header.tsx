import React from 'react';
import { Car, GraduationCap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-600">
          <Car size={28} />
          <h1 className="text-xl font-bold tracking-tight text-gray-900">AutoEscuela <span className="text-brand-600">AI</span></h1>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <GraduationCap size={18} />
          <span className="hidden sm:inline">Permiso B</span>
        </div>
      </div>
    </header>
  );
};
