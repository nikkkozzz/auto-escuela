import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, Question } from "../types";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Eres un profesor experto de autoescuela en España con más de 20 años de experiencia.
Tu objetivo es preparar alumnos para el examen teórico del Permiso B de la DGT (Dirección General de Tráfico).
Genera preguntas realistas, actualizadas a la normativa vigente.
Evita preguntas ambiguas.
Asegúrate de no repetir preguntas en el mismo lote.
El tono debe ser educativo y profesional pero alentador.
`;

export const generateQuestions = async (difficulty: Difficulty, count: number = 5): Promise<Question[]> => {
  let difficultyPrompt = "";
  
  switch (difficulty) {
    case Difficulty.BASIC:
      difficultyPrompt = "Céntrate en señales básicas, normas generales de prioridad y documentación simple. Preguntas fundamentales.";
      break;
    case Difficulty.INTERMEDIATE:
      difficultyPrompt = "Incluye velocidad, adelantamientos, alumbrado, carga y seguridad vial. Nivel medio de dificultad.";
      break;
    case Difficulty.ADVANCED:
      difficultyPrompt = "Preguntas trampa, situaciones complejas de tráfico, mecánica básica, primeros auxilios y normativa reciente. Alta dificultad.";
      break;
  }

  const prompt = `
    Genera ${count} preguntas de test distintas y únicas para el carnet de conducir tipo B en España.
    Nivel de dificultad: ${difficulty}.
    ${difficultyPrompt}
    Devuelve estrictamente un array JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: "El enunciado de la pregunta."
              },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 o 4 opciones de respuesta posibles."
              },
              correctIndex: {
                type: Type.INTEGER,
                description: "El índice (0-based) de la respuesta correcta en el array de opciones."
              },
              explanation: {
                type: Type.STRING,
                description: "Una explicación breve y didáctica de por qué esa es la respuesta correcta."
              },
              topic: {
                type: Type.STRING,
                description: "El tema de la pregunta (ej: Señales, Velocidad, Seguridad)."
              }
            },
            required: ["text", "options", "correctIndex", "explanation", "topic"]
          }
        }
      }
    });

    let jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini");
    }

    // Clean up markdown code blocks if present (just in case)
    jsonText = jsonText.replace(/```json|```/g, '').trim();

    const data = JSON.parse(jsonText);
    
    // Add unique IDs
    return data.map((q: any, index: number) => ({
      ...q,
      id: `${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Error generating questions:", error);
    // Fallback static questions in case of API failure or rate limit
    // Returning a small set for fallback, user will realize it's not 30 but better than crash
    return [
      {
        id: "fallback-1",
        text: "¿Cuál es la velocidad máxima genérica para un turismo en autovía?",
        options: ["100 km/h", "120 km/h", "110 km/h"],
        correctIndex: 1,
        explanation: "La velocidad máxima genérica para turismos y motocicletas en autovías y autopistas es de 120 km/h.",
        topic: "Velocidad"
      },
      {
        id: "fallback-2",
        text: "Ante esta señal de STOP, ¿qué debe hacer?",
        options: ["Detenerse siempre", "Ceder el paso sin detenerse si no vienen coches", "Detenerse solo si vienen vehículos"],
        correctIndex: 0,
        explanation: "La señal de STOP obliga a detenerse siempre ante la próxima línea de detención o, si no existe, inmediatamente antes de la intersección.",
        topic: "Señales"
      },
      {
        id: "fallback-3",
        text: "¿Está permitido circular marcha atrás en autopista?",
        options: ["Sí, en casos de emergencia", "No, nunca", "Sí, si me he pasado la salida"],
        correctIndex: 1,
        explanation: "En autopistas y autovías está prohibido circular marcha atrás.",
        topic: "Maniobras"
      }
    ];
  }
};