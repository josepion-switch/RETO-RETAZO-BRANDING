/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Rocket, 
  Hammer, 
  Diamond, 
  FlaskConical, 
  Brush, 
  Leaf, 
  Gavel, 
  BarChart, 
  Dices, 
  Shield, 
  Zap, 
  Globe, 
  Heart, 
  Coffee, 
  Music, 
  Camera, 
  ShoppingBag, 
  Car, 
  Home, 
  X,
  History as HistoryIcon,
  LucideIcon 
} from "lucide-react";
import { generateBrandingChallenge, BrandingChallenge } from "./services/geminiService";

// Icon mapping for Lucide
const iconMap: Record<string, LucideIcon> = {
  Rocket,
  Hammer,
  Diamond,
  FlaskConical,
  Brush,
  Leaf,
  Gavel,
  BarChart,
  Shield,
  Zap,
  Globe,
  Heart,
  Coffee,
  Music,
  Camera,
  ShoppingBag,
  Car,
  Home,
};

const fallbackSectors = ["Startup Tecnológica", "Cooperativa Artesanal", "Conglomerado de Lujo", "Laboratorio de Innovación", "Estudio de Diseño", "ONG Ambiental", "Firma de Abogados", "Consultora Digital"];
const fallbackCategories = ["Seguridad Informática", "EdTech", "Panadería Vegana", "Bienestar", "Finanzas Éticas", "Moda Sostenible", "Viajes de Aventura", "Mascotas"];
const fallbackNames = ["BioTrend", "Edulab", "FerreMax", "Segurify", "EcoNest", "TechGuard", "PurePath", "OmniHub"];

interface ReelProps {
  value: string;
  isSpinning: boolean;
  fallbackList: string[];
  label: string;
  icon?: LucideIcon;
  colorClass?: string;
}

function Reel({ value, isSpinning, fallbackList, label, icon: Icon, colorClass = "border-primary" }: ReelProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let interval: number;
    if (isSpinning) {
      interval = window.setInterval(() => {
        setDisplayValue(fallbackList[Math.floor(Math.random() * fallbackList.length)]);
      }, 100);
    } else {
      setDisplayValue(value);
    }
    return () => clearInterval(interval);
  }, [isSpinning, value, fallbackList]);

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between border-l-4 ${colorClass} overflow-hidden relative`}>
      <div className="mb-2 md:mb-0 relative z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">{label}</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={displayValue}
            initial={{ y: isSpinning ? 20 : 0, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: isSpinning ? -20 : 0, opacity: 0 }}
            transition={{ duration: isSpinning ? 0.1 : 0.5, ease: "easeOut" }}
            className="text-2xl font-bold text-gray-900 mt-1"
          >
            {displayValue}
          </motion.div>
        </AnimatePresence>
      </div>
      {Icon && (
        <motion.div
          animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
          transition={isSpinning ? { repeat: Infinity, duration: 0.5, ease: "linear" } : { duration: 0.5 }}
          className="relative z-10"
        >
          <Icon className={`w-8 h-8 ${colorClass.replace('border-', 'text- opacity-40')}`} />
        </motion.div>
      )}
    </div>
  );
}

export default function App() {
  const [challenge, setChallenge] = useState<BrandingChallenge>({
    sector: "Laboratorio de Innovación",
    category: "Bienestar",
    name: "Labinn",
    icon: "FlaskConical",
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<BrandingChallenge[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleSpin = useCallback(async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    // Start generating in background
    const generationPromise = generateBrandingChallenge();
    
    // Wait at least 1.2 seconds for the "feel" of the spin
    const minWait = new Promise(resolve => setTimeout(resolve, 1200));
    
    const [result] = await Promise.all([generationPromise, minWait]);
    
    setChallenge(result);
    setHistory(prev => [result, ...prev]);
    setIsSpinning(false);
  }, [isSpinning]);

  const SelectedIcon = iconMap[challenge.icon] || FlaskConical;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#191c1d] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="flex items-center justify-between w-full px-6 py-4 sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Reting Logo" className="h-10 w-auto" referrerPolicy="no-referrer" />
        </div>
        <div className="hidden md:flex gap-8 items-center">
          <button 
            onClick={() => {
              setIsHistoryOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-blue-600 font-semibold hover:bg-gray-100 transition-colors px-3 py-1 rounded-lg"
          >
            Challenge
          </button>
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="text-gray-500 hover:bg-gray-100 transition-colors px-3 py-1 rounded-lg"
          >
            History
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Hero Section */}
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tighter mb-4 font-headline"
          >
            Reto <span className="text-blue-600">Retazo</span> de Branding
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-xl max-w-2xl leading-relaxed"
          >
            Supera el bloqueo creativo practicando con este reto haciendo marcas aleatorias.
          </motion.p>
        </div>

        <div className="flex flex-col items-center">
          {/* Slot Machine Panel */}
          <div className="w-full max-w-2xl space-y-6">
            <div className="bg-gray-100 p-8 rounded-[2rem] shadow-2xl space-y-4">
              {/* Sector Reel */}
              <Reel 
                label="Sector del Negocio" 
                value={challenge.sector} 
                isSpinning={isSpinning} 
                fallbackList={fallbackSectors} 
                icon={SelectedIcon}
                colorClass="border-blue-600"
              />

              {/* Category Reel */}
              <Reel 
                label="Categoría" 
                value={challenge.category} 
                isSpinning={isSpinning} 
                fallbackList={fallbackCategories} 
                icon={Zap}
                colorClass="border-orange-500"
              />

              {/* Name Reel */}
              <div className="bg-blue-50 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent"></div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600 mb-4 relative z-10">Nombre Sugerido</span>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isSpinning ? "spinning" : challenge.name}
                    initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: isSpinning ? 0.2 : 0.6, ease: "easeOut" }}
                    className="text-6xl md:text-7xl font-black text-blue-600 tracking-tighter relative z-10 font-headline"
                  >
                    {isSpinning ? "" : challenge.name}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <button 
                onClick={handleSpin}
                disabled={isSpinning}
                className={`w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-6 rounded-xl font-bold text-xl flex items-center justify-center gap-4 transition-all shadow-lg active:scale-[0.98] ${isSpinning ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                <Dices className={`w-8 h-8 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? "Girando..." : "¡Girar Tómbola!"}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* History Slide-over */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-xl font-bold font-headline">Historial de Retos</h2>
                <button 
                  onClick={() => setIsHistoryOpen(false)} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <HistoryIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Aún no has generado ningún reto.</p>
                  </div>
                ) : (
                  history.map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors group"
                    >
                      <div className="font-bold text-lg text-blue-600 group-hover:text-blue-700 transition-colors">
                        {item.name}
                      </div>
                      <div className="text-sm text-gray-500 leading-relaxed">
                        ({item.sector} — {item.category})
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 py-12 bg-gray-200 text-gray-500 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <img src="/logo.png" alt="Reting Logo" className="h-8 w-auto mx-auto mb-2" referrerPolicy="no-referrer" />
          <p className="text-sm">© 2024 Reting - Generador de Desafíos de Branding. Herramienta para profesionales.</p>
        </div>
      </footer>
    </div>
  );
}
