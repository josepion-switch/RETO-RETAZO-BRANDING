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
    { sector: "Firma de Abogados", category: "Propiedad Intelectual", name: "LegalMind", icon: "Gavel" },
    { sector: "Estudio de Diseño", category: "Branding Minimalista", name: "MiniBrand", icon: "Brush" },
    { sector: "Consultora Digital", category: "Transformación Cloud", name: "CloudNexa", icon: "Zap" },
    { sector: "Agencia de Viajes", category: "Ecoturismo", name: "EcoRutas", icon: "Globe" },
    { sector: "Restaurante Gourmet", category: "Cocina Molecular", name: "MolecuLab", icon: "Coffee" },
    { sector: "Tienda de Ropa", category: "Moda Circular", name: "ReVestir", icon: "ShoppingBag" },
    { sector: "App de Fitness", category: "Yoga en Casa", name: "ZenFlow", icon: "Heart" },
    { sector: "Plataforma de Música", category: "Streaming Indie", name: "IndieWave", icon: "Music" },
    { sector: "Estudio Fotográfico", category: "Retrato Artístico", name: "FotoLuz", icon: "Camera" },
    { sector: "Empresa de Logística", category: "Entregas con Drones", name: "Dronify", icon: "Car" },
    { sector: "Inmobiliaria", category: "Casas Inteligentes", name: "SmartHogar", icon: "Home" },
    { sector: "Fintech", category: "Criptomonedas", name: "CryptoVía", icon: "BarChart" },
    { sector: "EdTech", category: "Aprendizaje de Idiomas", name: "LingoMax", icon: "Rocket" },
    { sector: "HealthTech", category: "Telemedicina", name: "TeleSana", icon: "Heart" },
    { sector: "AgroTech", category: "Cultivos Hidropónicos", name: "HidroGrow", icon: "Leaf" },
    { sector: "FoodTech", category: "Carne Vegetal", name: "VeggieMeat", icon: "Coffee" },
    { sector: "E-commerce", category: "Artesanía Local", name: "ArteCerca", icon: "ShoppingBag" },
    { sector: "Ciberseguridad", category: "Protección de Datos", name: "DataGuard", icon: "Shield" },
    { sector: "Biotecnología", category: "Genética", name: "GenoLab", icon: "FlaskConical" },
    { sector: "Arquitectura", category: "Diseño Bioclimático", name: "BioArqui", icon: "Home" },
    { sector: "Marketing", category: "Neuromarketing", name: "NeuroMkt", icon: "Zap" },
    { sector: "Educación", category: "Gamificación", name: "GamiLearn", icon: "Rocket" },
    { sector: "Moda", category: "Accesorios Upcycled", name: "UpCycle", icon: "ShoppingBag" },
    { sector: "Belleza", category: "Cosmética Natural", name: "PuraBio", icon: "Heart" },
    { sector: "Deportes", category: "E-sports", name: "GamerPro", icon: "Zap" },
    { sector: "Entretenimiento", category: "Realidad Virtual", name: "VRWorld", icon: "Globe" },
    { sector: "Sostenibilidad", category: "Reciclaje de Plástico", name: "PlastFix", icon: "Leaf" },
    { sector: "Finanzas", category: "Microcréditos", name: "MicroFin", icon: "BarChart" },
    { sector: "Turismo", category: "Turismo Espacial", name: "AstroViaje", icon: "Rocket" },
    { sector: "Automotriz", category: "Coches Eléctricos", name: "VoltDrive", icon: "Car" },
    { sector: "Gastronomía", category: "Cerveza Artesana", name: "BirraLab", icon: "Coffee" },
    { sector: "Arte", category: "Galería Digital", name: "ArtNexa", icon: "Brush" },
    { sector: "Derecho", category: "Derecho Digital", name: "LexTech", icon: "Gavel" },
    { sector: "Salud", category: "Salud Mental", name: "MenteSana", icon: "Heart" },
    { sector: "Tecnología", category: "Inteligencia Artificial", name: "AIBrain", icon: "Zap" },
    { sector: "Construcción", category: "Materiales Ecológicos", name: "EcoBlock", icon: "Home" },
    { sector: "Moda Infantil", category: "Ropa Orgánica", name: "BebéBio", icon: "ShoppingBag" },
    { sector: "Mascotas", category: "Nutrición Canina", name: "CaninNutri", icon: "Heart" },
    { sector: "Jardinería", category: "Huertos Urbanos", name: "HuertoCity", icon: "Leaf" },
    { sector: "Limpieza", category: "Productos Biodegradables", name: "LimpiaBio", icon: "Zap" },
    { sector: "Seguros", category: "Seguros para Freelancers", name: "FreeInsure", icon: "Shield" },
    { sector: "Eventos", category: "Bodas Sostenibles", name: "EcoBoda", icon: "Heart" },
    { sector: "Mobiliario", category: "Muebles Modulares", name: "ModuHome", icon: "Home" },
    { sector: "Papelería", category: "Papel de Semillas", name: "SemmaPapel", icon: "Leaf" },
    { sector: "Joyas", category: "Joyas Impresas en 3D", name: "Joyas3D", icon: "Diamond" },
    { sector: "Vinos", category: "Vinos Orgánicos", name: "VinoBio", icon: "Coffee" },
    { sector: "Cine", category: "Producción Independiente", name: "IndieFilm", icon: "Camera" },
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
