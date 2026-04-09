import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface BrandingChallenge {
  sector: string;
  category: string;
  name: string;
  icon: string; // Lucide icon name
}

const schema = {
  type: Type.OBJECT,
  properties: {
    sector: { type: Type.STRING, description: "Sector del negocio (ej. Startup Tecnológica, Cooperativa Artesanal)" },
    category: { type: Type.STRING, description: "Categoría específica (ej. Seguridad Informática, EdTech, Panadería Vegana)" },
    name: { type: Type.STRING, description: "Nombre original tipo startup en español (ej. BioTrend, Edulab, FerreMax)" },
    icon: { type: Type.STRING, description: "Nombre de un icono de Lucide-React que represente el sector (ej. Rocket, Hammer, Diamond, Science, Brush, Leaf, Gavel, BarChart)" },
  },
  required: ["sector", "category", "name", "icon"],
};

export async function generateBrandingChallenge(): Promise<BrandingChallenge> {
  const fallbacks: BrandingChallenge[] = [
    { sector: "Startup Tecnológica", category: "Seguridad Informática", name: "Segurify", icon: "Shield" },
    { sector: "Cooperativa Artesanal", category: "Panadería Vegana", name: "PanEco", icon: "Hammer" },
    { sector: "Laboratorio de Innovación", category: "EdTech", name: "EduLab", icon: "FlaskConical" },
    { sector: "ONG Ambiental", category: "Energía Solar", name: "Solara", icon: "Leaf" },
    { sector: "Firma de Abogados", icon: "Gavel", category: "Propiedad Intelectual", name: "LegalMind" },
  ];

  const timeoutPromise = new Promise<null>((resolve) => 
    setTimeout(() => resolve(null), 5000) // 5 second timeout
  );

  try {
    const apiPromise = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Genera un desafío de branding coherente y creativo. El sector y la categoría deben estar relacionados. El nombre debe ser una mezcla de palabras original que suene bien en español. Devuelve solo un objeto JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const response = await Promise.race([apiPromise, timeoutPromise]);

    if (!response) {
      console.warn("Gemini API timed out, using fallback.");
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as BrandingChallenge;
  } catch (error) {
    console.error("Error generating branding challenge:", error);
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}
