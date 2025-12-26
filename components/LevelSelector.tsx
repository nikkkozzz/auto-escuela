import React from 'react';
import { Difficulty } from '../types';
import { ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface LevelSelectorProps {
  onSelect: (level: Difficulty) => void;
  isLoading: boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelect, isLoading }) => {
  const levels = [
    {
      id: Difficulty.BASIC,
      title: "Nivel Básico",
      description: "Ideal para principiantes. Señales básicas, normas de prioridad simples y definiciones.",
      icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
      color: "hover:border-green-500 hover:bg-green-50"
    },
    {
      id: Difficulty.INTERMEDIATE,
      title: "Nivel Intermedio",
      description: "Profundiza en velocidades, maniobras, alumbrado y mecánica básica.",
      icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
      color: "hover:border-blue-500 hover:bg-blue-50"
    },
    {
      id: Difficulty.ADVANCED,
      title: "Nivel Avanzado",
      description: "Preguntas trampa, normativa reciente, seguridad vial compleja y primeros auxilios.",
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      color: "hover:border-orange-500 hover:bg-orange-50"
    }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Elige tu nivel de práctica</h2>
        <p className="text-gray-600 mt-2">La inteligencia artificial generará un test personalizado para ti.</p>
      </div>

      <div className="grid gap-4">
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            disabled={isLoading}
            className={`
              relative flex items-center p-6 bg-white border-2 border-gray-100 rounded-xl transition-all duration-200 shadow-sm
              ${level.color}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
            `}
          >
            <div className="bg-gray-50 p-3 rounded-full mr-5 border border-gray-100">
              {level.icon}
            </div>
            <div className="text-left flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{level.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{level.description}</p>
            </div>
            <div className="ml-4 text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
