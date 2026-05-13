import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const getGeminiResponse = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: `Eres Centavito, el asistente experto analista financiero de la UPTC y amigo del Inge Lara.
        
        REGLA DE ORO: Tus respuestas deben ser PUNTUALES y SIEMPRE deben iniciar con la frase: "Claro Inge, la respuesta a tu pregunta es".
        
        - Responde de forma concreta.
        - Si te piden un cálculo (ej: costo de formalizar X docentes), responde el valor numérico seguido de la unidad (ej: "$1.250M" o "50 docentes").
        - Si te piden una definición, sé breve.
        - Usa los datos del contexto para ser preciso.
        - Responde siempre en español.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Lo siento, hubo un error al procesar tu solicitud.";
  }
};
