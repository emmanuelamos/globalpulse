/*
 * Design: Neon Broadcast — Cyberpunk News Terminal
 * Component: Language selector dropdown — compact globe icon that opens a searchable language list
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, ChevronDown, Search } from "lucide-react";
import { useLanguage, LANGUAGES } from "@/contexts/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open]);

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="flex items-center gap-1.5 h-9 px-2.5 rounded-lg border border-neon-cyan/20 text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-all"
        aria-label="Select language"
      >
        <span className="text-sm">{language.flag}</span>
        <span className="hidden sm:inline text-xs font-display font-medium">{language.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-xl glass-card border border-neon-cyan/20 shadow-2xl z-50 overflow-hidden"
          >
            {/* Search */}
            <div className="p-2 border-b border-border/50">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
                <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search language..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-body"
                />
              </div>
            </div>

            {/* Language list */}
            <div className="max-h-72 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No language found
                </div>
              ) : (
                filtered.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${
                      language.code === lang.code
                        ? "bg-neon-cyan/10 text-neon-cyan"
                        : "text-foreground hover:bg-neon-cyan/5"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-display font-medium block">{lang.name}</span>
                      <span className="text-[10px] text-muted-foreground">{lang.nativeName}</span>
                    </div>
                    {language.code === lang.code && (
                      <span className="w-2 h-2 rounded-full bg-neon-cyan shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-border/50 flex items-center gap-2">
              <Languages className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-mono">
                {LANGUAGES.length} languages available
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Compact version for mobile menu */
export function LanguageSelectorMobile() {
  const { language, setLanguage } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-display font-medium text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/5 transition-all"
      >
        <Languages className="w-4 h-4" />
        <span>{language.flag} {language.name}</span>
        <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-1 px-4 py-2 max-h-48 overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang);
                    setExpanded(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                    language.code === lang.code
                      ? "bg-neon-cyan/10 text-neon-cyan font-bold"
                      : "text-muted-foreground hover:bg-neon-cyan/5"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
