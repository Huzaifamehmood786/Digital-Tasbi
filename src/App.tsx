import { useState, useEffect } from 'react';
import { translations, type Language } from './utils/translations';
import { cn } from './utils/cn';
import { 
  RotateCcw, 
  Settings as SettingsIcon, 
  Globe, 
  Moon, 
  Sun, 
  Trophy, 
  History 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [count, setCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [target, setTarget] = useState<number | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isTargetReached, setIsTargetReached] = useState(false);

  const t = translations[lang];

  // Load data from localStorage
  useEffect(() => {
    const savedTotal = localStorage.getItem('tasbih_total');
    const savedTarget = localStorage.getItem('tasbih_target');
    const savedLang = localStorage.getItem('tasbih_lang') as Language;
    const savedTheme = localStorage.getItem('tasbih_theme');

    if (savedTotal) setTotalCount(parseInt(savedTotal));
    if (savedTarget) setTarget(savedTarget === 'null' ? null : parseInt(savedTarget));
    if (savedLang && translations[savedLang]) setLang(savedLang);
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('tasbih_total', totalCount.toString());
    localStorage.setItem('tasbih_target', target ? target.toString() : 'null');
    localStorage.setItem('tasbih_lang', lang);
    localStorage.setItem('tasbih_theme', isDarkMode ? 'dark' : 'light');
  }, [totalCount, target, lang, isDarkMode]);

  const increment = () => {
    setCount(prev => prev + 1);
    setTotalCount(prev => prev + 1);
    
    if (target && count + 1 === target) {
      setIsTargetReached(true);
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  };

  const reset = () => {
    if (confirm(`${t.reset}?`)) {
      setCount(0);
      setIsTargetReached(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 flex flex-col font-sans",
      isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* Header */}
      <header className={cn(
        "p-4 flex justify-between items-center backdrop-blur-md sticky top-0 z-10",
        isDarkMode ? "bg-slate-900/50 border-b border-slate-800" : "bg-white/50 border-b border-slate-200"
      )}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
            T
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className={cn(
              "p-2 rounded-full transition-colors",
              isDarkMode ? "hover:bg-slate-800 text-yellow-400" : "hover:bg-slate-200 text-slate-600"
            )}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className={cn(
              "p-2 rounded-full transition-colors",
              isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-200"
            )}
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

        {/* Stats Summary */}
        <div className="flex gap-8 mb-12 text-center">
          <div>
            <p className={cn("text-xs uppercase tracking-widest mb-1", isDarkMode ? "text-slate-400" : "text-slate-500")}>
              {t.session}
            </p>
            <p className="text-2xl font-medium">{count}</p>
          </div>
          <div className="w-px h-10 bg-slate-700/30 self-center" />
          <div>
            <p className={cn("text-xs uppercase tracking-widest mb-1", isDarkMode ? "text-slate-400" : "text-slate-500")}>
              {t.total}
            </p>
            <p className="text-2xl font-medium">{totalCount}</p>
          </div>
        </div>

        {/* Main Counter Button */}
        <div className="relative">
          <motion.button 
            whileTap={{ scale: 0.92 }}
            onClick={increment}
            className={cn(
              "w-64 h-64 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 shadow-2xl",
              "border-8",
              isDarkMode 
                ? "bg-slate-900 border-slate-800 text-slate-100 hover:border-emerald-500/50 shadow-emerald-500/10" 
                : "bg-white border-slate-100 text-slate-900 hover:border-emerald-500/50 shadow-emerald-500/20"
            )}
          >
            <span className="text-7xl font-bold tabular-nums">{count}</span>
            
            {/* Ripple Effect Outer Circle */}
            <motion.div 
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="absolute inset-0 rounded-full border-2 border-emerald-500 pointer-events-none"
            />
          </motion.button>

          {/* Target Indicator */}
          {target && (
            <div className={cn(
              "absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium transition-colors",
              isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-200 text-slate-600"
            )}>
              {t.target}: {target}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-20 flex gap-4">
          <button 
            onClick={reset}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all",
              isDarkMode 
                ? "bg-slate-800 hover:bg-slate-700 text-slate-300" 
                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
            )}
          >
            <RotateCcw size={18} />
            {t.reset}
          </button>
          
          <button 
            onClick={() => setShowStats(true)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all",
              isDarkMode 
                ? "bg-emerald-600 hover:bg-emerald-500 text-white" 
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            )}
          >
            <History size={18} />
            {t.stats}
          </button>
        </div>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-md rounded-3xl p-6 shadow-2xl",
                isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"
              )}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{t.settings}</h2>
                <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-slate-700">✕</button>
              </div>

              <div className="space-y-6">
                {/* Language Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Globe size={16} /> {t.changeLanguage}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['en', 'ur', 'ar'] as Language[]).map((l) => (
                      <button 
                        key={l}
                        onClick={() => setLang(l)}
                        className={cn(
                          "py-2 rounded-xl text-sm font-medium transition-all border",
                          lang === l 
                            ? "bg-emerald-600 border-emerald-600 text-white" 
                            : isDarkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"
                        )}
                      >
                        {l === 'en' ? 'English' : l === 'ur' ? 'اردو' : 'العربية'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Setting */}
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Trophy size={16} /> {t.target}
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={target || ''}
                      onChange={(e) => setTarget(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder={t.noTarget}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-xl outline-none transition-all border",
                        isDarkMode 
                          ? "bg-slate-800 border-slate-700 text-white focus:border-emerald-500" 
                          : "bg-slate-100 border-slate-200 text-slate-900 focus:border-emerald-500"
                      )}
                    />
                    <button 
                      onClick={() => setTarget(null)}
                      className="px-4 py-2 text-sm text-slate-500 hover:text-red-500 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full mt-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                {t.save}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                "w-full max-w-md rounded-3xl p-6 shadow-2xl",
                isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"
              )}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{t.stats}</h2>
                <button onClick={() => setShowStats(false)} className="text-slate-500 hover:text-slate-700">✕</button>
              </div>

              <div className="space-y-4">
                <div className={cn(
                  "p-4 rounded-2xl flex justify-between items-center",
                  isDarkMode ? "bg-slate-800" : "bg-slate-100"
                )}>
                  <span className="text-slate-500">{t.total}</span>
                  <span className="text-2xl font-bold">{totalCount}</span>
                </div>
                <div className={cn(
                  "p-4 rounded-2xl flex justify-between items-center",
                  isDarkMode ? "bg-slate-800" : "bg-slate-100"
                )}>
                  <span className="text-slate-500">{t.session}</span>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
              </div>

              <button 
                onClick={() => setShowStats(false)}
                className="w-full mt-8 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-2xl font-bold transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Target Reached Notification */}
      <AnimatePresence>
        {isTargetReached && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold whitespace-nowrap">
              <Trophy size={20} />
              {t.targetReached}
              <button 
                onClick={() => setIsTargetReached(false)}
                className="ml-2 bg-white/20 hover:bg-white/30 rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
