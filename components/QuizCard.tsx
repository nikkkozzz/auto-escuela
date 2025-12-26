import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (optionIndex: number) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ question, questionNumber, totalQuestions, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset local state when question changes
  React.useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [question.id]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      onAnswer(selectedOption);
    }
  };

  const getOptionStyle = (index: number) => {
    if (!isSubmitted) {
      return selectedOption === index
        ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
        : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50';
    }

    if (index === question.correctIndex) {
      return 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500';
    }

    if (index === selectedOption && index !== question.correctIndex) {
      return 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500';
    }

    return 'border-gray-100 opacity-60';
  };

  const getOptionIcon = (index: number) => {
    if (!isSubmitted) return <div className={`w-5 h-5 rounded-full border-2 ${selectedOption === index ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`} />;
    
    if (index === question.correctIndex) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (index === selectedOption) return <XCircle className="w-5 h-5 text-red-600" />;
    return <div className="w-5 h-5 rounded-full border-2 border-gray-200" />;
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      
      {/* Progress Indicator */}
      <div className="mb-6 flex items-center justify-between text-sm font-medium text-gray-500">
        <span>Pregunta {questionNumber} de {totalQuestions}</span>
        <span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase tracking-wide text-gray-600">{question.topic || 'General'}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Question Text */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed">
            {question.text}
          </h3>
        </div>

        {/* Options */}
        <div className="p-6 md:p-8 space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !isSubmitted && setSelectedOption(index)}
              disabled={isSubmitted}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${getOptionStyle(index)}`}
            >
              <span className="flex-shrink-0">{getOptionIcon(index)}</span>
              <span className="text-base md:text-lg">{option}</span>
            </button>
          ))}
        </div>

        {/* Explanation / Footer */}
        {isSubmitted ? (
          <div className="px-6 md:px-8 pb-8 animate-in slide-in-from-top-2">
            <div className={`p-4 rounded-xl ${selectedOption === question.correctIndex ? 'bg-green-50 border border-green-100' : 'bg-blue-50 border border-blue-100'}`}>
              <div className="flex items-start gap-3">
                <HelpCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${selectedOption === question.correctIndex ? 'text-green-600' : 'text-blue-600'}`} />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    {selectedOption === question.correctIndex ? '¡Correcto!' : 'Explicación:'}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-brand-500/30"
              >
                {questionNumber === totalQuestions ? 'Ver Resultados' : 'Siguiente Pregunta'}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="px-6 md:px-8 pb-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`
                flex items-center gap-2 font-semibold py-3 px-8 rounded-xl transition-all shadow-lg
                ${selectedOption === null 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/30 active:scale-95'}
              `}
            >
              Comprobar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
