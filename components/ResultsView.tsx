import React from 'react';
import { QuizState } from '../types';
import { Trophy, RotateCcw, Home, XCircle, CheckCircle2 } from 'lucide-react';

interface ResultsViewProps {
  state: QuizState;
  onRetry: () => void;
  onHome: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ state, onRetry, onHome }) => {
  const errors = state.questions.length - state.score;
  const isPass = errors < 3; // Pass if errors are strictly less than 3 (0, 1, or 2 errors)

  return (
    <div className="max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-center p-8 md:p-12">
        
        <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-full mb-6">
          {isPass ? (
            <Trophy className="w-16 h-16 text-yellow-500" />
          ) : (
            <div className="relative">
               <Trophy className="w-16 h-16 text-gray-300" />
               <XCircle className="w-8 h-8 text-red-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isPass ? '¡Apto! 🎉' : 'No Apto'}
        </h2>
        
        <div className="text-gray-600 mb-8 text-lg">
          <p className="mb-2">
            Has acertado <span className={`font-bold ${isPass ? 'text-green-600' : 'text-gray-900'}`}>{state.score}</span> de <span className="font-bold">{state.questions.length}</span> preguntas.
          </p>
          <div className={`inline-flex items-center px-4 py-2 rounded-lg ${isPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <span className="font-semibold">{errors} {errors === 1 ? 'fallo' : 'fallos'}</span>
          </div>
          <p className="text-sm mt-3 opacity-80">
            {isPass 
              ? 'Has superado la prueba (menos de 3 fallos).' 
              : 'Has superado el límite de fallos permitido (menos de 3).'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <RotateCcw size={20} />
            Intentar otro test
          </button>
          <button
            onClick={onHome}
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <Home size={20} />
            Volver al inicio
          </button>
        </div>
      </div>

      {/* Review Errors */}
      {state.score < state.questions.length && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 px-2">Repaso de errores</h3>
          <div className="space-y-4">
            {state.questions.map((q, idx) => {
              const userAnswer = state.answers[idx];
              if (userAnswer === q.correctIndex) return null;
              
              return (
                <div key={q.id} className="bg-white rounded-xl border border-red-100 p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 font-bold text-lg mt-0.5">#{idx + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-3">{q.text}</p>
                      
                      <div className="space-y-2 text-sm">
                         <div className="flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded-lg">
                           <XCircle size={16} />
                           <span>Tu respuesta: {q.options[userAnswer]}</span>
                         </div>
                         <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg">
                           <CheckCircle2 size={16} />
                           <span>Correcta: {q.options[q.correctIndex]}</span>
                         </div>
                      </div>
                      
                      <p className="mt-3 text-sm text-gray-600 border-t border-gray-100 pt-3">
                        <span className="font-semibold">Por qué:</span> {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};