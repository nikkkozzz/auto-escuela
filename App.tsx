import React, { useState } from 'react';
import { Header } from './components/Header';
import { LevelSelector } from './components/LevelSelector';
import { QuizCard } from './components/QuizCard';
import { ResultsView } from './components/ResultsView';
import { AppView, Difficulty, QuizState } from './types';
import { generateQuestions } from './services/gemini';
import { Loader2 } from 'lucide-react';

const INITIAL_STATE: QuizState = {
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  isFinished: false,
  questions: []
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [loading, setLoading] = useState(false);
  const [quizState, setQuizState] = useState<QuizState>(INITIAL_STATE);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const startQuiz = async (level: Difficulty) => {
    setLoading(true);
    setDifficulty(level);
    
    try {
      // Generate 30 questions for full exam practice as requested
      const questions = await generateQuestions(level, 30);
      setQuizState({
        ...INITIAL_STATE,
        questions: questions
      });
      setView('quiz');
    } catch (error) {
      console.error("Failed to start quiz", error);
      alert("Hubo un error generando el test. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const currentQ = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = optionIndex === currentQ.correctIndex;

    const nextState = {
      ...quizState,
      answers: [...quizState.answers, optionIndex],
      score: isCorrect ? quizState.score + 1 : quizState.score,
    };

    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
      setQuizState({
        ...nextState,
        currentQuestionIndex: quizState.currentQuestionIndex + 1
      });
    } else {
      setQuizState({
        ...nextState,
        isFinished: true
      });
      setView('results');
    }
  };

  const resetApp = () => {
    setView('home');
    setQuizState(INITIAL_STATE);
    setDifficulty(null);
  };

  const retryQuiz = () => {
    if (difficulty) {
      startQuiz(difficulty);
    } else {
      resetApp();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 flex flex-col justify-start md:justify-center">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <Loader2 className="w-12 h-12 text-brand-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Generando Test Inteligente...</h3>
            <p className="text-gray-500 mt-2">Creando 30 preguntas adaptadas a tu nivel.</p>
          </div>
        )}

        {!loading && view === 'home' && (
          <LevelSelector onSelect={startQuiz} isLoading={loading} />
        )}

        {!loading && view === 'quiz' && quizState.questions.length > 0 && (
          <QuizCard
            question={quizState.questions[quizState.currentQuestionIndex]}
            questionNumber={quizState.currentQuestionIndex + 1}
            totalQuestions={quizState.questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {!loading && view === 'results' && (
          <ResultsView 
            state={quizState} 
            onRetry={retryQuiz} 
            onHome={resetApp} 
          />
        )}
      </main>

      <footer className="py-6 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} AutoEscuela AI. Generado con Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;