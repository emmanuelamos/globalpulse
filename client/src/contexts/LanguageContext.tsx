import React, { createContext, useContext, useState, useCallback } from "react";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
];

// Translation keys for all static content on the landing page
type TranslationKeys = {
  // Navbar
  "nav.trends": string;
  "nav.rankings": string;
  "nav.broadcasters": string;
  "nav.search": string;
  "nav.enterPulse": string;
  "nav.lightMode": string;
  "nav.darkMode": string;
  "nav.language": string;
  // Hero
  "hero.badge": string;
  "hero.title1": string;
  "hero.title2": string;
  "hero.title3": string;
  "hero.title4": string;
  "hero.subtitle": string;
  "hero.cta1": string;
  "hero.cta2": string;
  "hero.stat1": string;
  "hero.stat2": string;
  "hero.stat3": string;
  // Trending
  "trending.label": string;
  "trending.title1": string;
  "trending.title2": string;
  "trending.swipe": string;
  "trending.exploreAll": string;
  "trending.diveDeeper": string;
  // Rankings
  "rankings.label": string;
  "rankings.title1": string;
  "rankings.title2": string;
  "rankings.subtitle": string;
  // Broadcasters
  "broadcast.label": string;
  "broadcast.title1": string;
  "broadcast.title2": string;
  "broadcast.subtitle": string;
  "broadcast.liveNow": string;
  "broadcast.listening": string;
  "broadcast.callIn": string;
  "broadcast.callInPrice": string;
  "broadcast.callInDesc": string;
  "broadcast.countryRooms": string;
  "broadcast.upcoming": string;
  // Features
  "features.label": string;
  "features.title1": string;
  "features.title2": string;
  // Pricing
  "pricing.label": string;
  "pricing.title1": string;
  "pricing.title2": string;
  "pricing.free": string;
  "pricing.premium": string;
  "pricing.callIn": string;
  "pricing.perMonth": string;
  "pricing.perCall": string;
  "pricing.getStarted": string;
  "pricing.goPremium": string;
  "pricing.buyCredits": string;
  "pricing.mostPopular": string;
  // CTA
  "cta.title1": string;
  "cta.title2": string;
  "cta.subtitle": string;
  "cta.placeholder": string;
  "cta.joinWaitlist": string;
  "cta.noSpam": string;
  // Footer
  "footer.tagline": string;
  "footer.product": string;
  "footer.company": string;
  "footer.legal": string;
  "footer.connect": string;
  "footer.rights": string;

  // trends page
  "trendsPage.title": string;
  "trendsPage.subtitle": string;
  "trendsPage.all": string;
  "trendsPage.rankings": string;
  "trendsPage.stories": string;
  "trendsPage.globalRankings": string;
  "trendsPage.live": string;
  
  // Categories
  "cat.crime": string;
  "cat.trending": string;
  "cat.funny": string;
  "cat.entertainment": string;
  "cat.celebrity": string;
  "cat.gossip": string;
  "cat.weather": string;
  "cat.business": string;
  "cat.sports": string;

  // Broadcasters Page (Detailed)
  "broadcast.title": string;
  "broadcast.nav.live": string;
  "broadcast.nav.schedule": string;
  "broadcast.nav.past": string;
  "broadcast.nav.rooms": string;
  "broadcast.liveTranscript": string;
  "broadcast.callInQueue": string;
  "broadcast.joinQueue": string;
  "broadcast.premiumGate.title": string;
  "broadcast.premiumGate.description": string;
  "broadcast.premiumGate.subscribe": string;
  "broadcast.premiumGate.later": string;
  "broadcast.features.rewind": string;
  "broadcast.features.record": string;
  "broadcast.features.archive": string;
  "broadcast.features.adFree": string;
  "broadcast.features.priority": string;
};

const translations: Record<string, TranslationKeys> = {
  en: {
    "nav.trends": "Trends",
    "nav.rankings": "Rankings",
    "nav.broadcasters": "Broadcasters",
    "nav.search": "Search",
    "nav.enterPulse": "Enter the Pulse",
    "nav.lightMode": "Light Mode",
    "nav.darkMode": "Dark Mode",
    "nav.language": "Language",
    "hero.badge": "BROADCASTING NOW — 47 COUNTRIES",
    "hero.title1": "The World's",
    "hero.title2": "Newsroom.",
    "hero.title3": "In Your",
    "hero.title4": "Pocket.",
    "hero.subtitle": "Swipe through global trends. Watch AI anchors roast the headlines. Call in live. Rank every city on Earth. This isn't news — it's the pulse of the planet.",
    "hero.cta1": "Enter the Pulse",
    "hero.cta2": "Tune In Live",
    "hero.stat1": "Countries Ranked",
    "hero.stat2": "Live Listeners",
    "hero.stat3": "Stories Today",
    "trending.label": "/// What's Buzzing Right Now",
    "trending.title1": "9 Categories.",
    "trending.title2": "Infinite Buzz.",
    "trending.swipe": "Swipe to explore every category",
    "trending.exploreAll": "Explore All",
    "trending.diveDeeper": "Dive deeper",
    "rankings.label": "/// Global Rankings",
    "rankings.title1": "Every City. Every Country.",
    "rankings.title2": "Ranked.",
    "rankings.subtitle": "From safest to most dangerous, hottest weather to coldest, fun vibes to calm — drill down from global to your neighborhood.",
    "broadcast.label": "/// Broadcasters Room",
    "broadcast.title1": "Two AI Anchors. Live Call-Ins.",
    "broadcast.title2": "Your Voice.",
    "broadcast.subtitle": "Meet Marcus (American) and Victoria (British) — your AI-powered news anchors with personality, roasts, and hot takes. Call in live to share your opinion. 100 global calls + 50 per country, every single day. Country rooms with anchors speaking your language — Hindi, French, Portuguese, Pidgin, and more.",
    "broadcast.liveNow": "LIVE NOW",
    "broadcast.listening": "listening",
    "broadcast.callIn": "Call-In Queue",
    "broadcast.callInPrice": "Call In — $0.99",
    "broadcast.callInDesc": "45-60 sec live with AI anchor • Free text chat available",
    "broadcast.countryRooms": "Country Rooms",
    "broadcast.upcoming": "Upcoming:",
    "features.label": "/// Why GlobalPulse",
    "features.title1": "Built Different.",
    "features.title2": "Feels Different.",
    "pricing.label": "/// Choose Your Pulse",
    "pricing.title1": "Free to Browse.",
    "pricing.title2": "Premium to Dominate.",
    "pricing.free": "Free",
    "pricing.premium": "Premium",
    "pricing.callIn": "Call-In",
    "pricing.perMonth": "/month",
    "pricing.perCall": "/call",
    "pricing.getStarted": "Get Started Free",
    "pricing.goPremium": "Go Premium",
    "pricing.buyCredits": "Buy Credits",
    "pricing.mostPopular": "MOST POPULAR",
    "cta.title1": "The World Is Talking.",
    "cta.title2": "Are You Listening?",
    "cta.subtitle": "Join the waitlist and be first to experience GlobalPulse when we launch. Early members get Premium free for 3 months.",
    "cta.placeholder": "Enter your email",
    "cta.joinWaitlist": "Join Waitlist",
    "cta.noSpam": "No spam. Unsubscribe anytime. We respect your inbox.",
    "footer.tagline": "The world's newsroom in your pocket. Trending news, global rankings, AI broadcasters, and live call-ins.",
    "footer.product": "Product",
    "footer.company": "Company",
    "footer.legal": "Legal",
    "footer.connect": "Connect",
    "footer.rights": "All rights reserved.",
    "trendsPage.title": "All Trends",
    "trendsPage.subtitle": "What the world is buzzing about right now. Ranked by heat score.",
    "trendsPage.all": "All",
    "trendsPage.rankings": "Rankings",
    "trendsPage.stories": "Stories",
    "trendsPage.globalRankings": "GLOBAL RANKINGS",
    "trendsPage.live": "live",
    "cat.crime": "Crime",
    "cat.trending": "Trending",
    "cat.funny": "Funny",
    "cat.entertainment": "Entertainment",
    "cat.celebrity": "Celebrity",
    "cat.gossip": "Gossip",
    "cat.weather": "Weather",
    "cat.business": "Business",
    "cat.sports": "Sports",
    "broadcast.title": "Broadcasters Room",
    "broadcast.nav.live": "Live Now",
    "broadcast.nav.schedule": "Schedule",
    "broadcast.nav.past": "Past Broadcasts",
    "broadcast.nav.rooms": "Country Rooms",
    "broadcast.liveTranscript": "Live Transcript",
    "broadcast.callInQueue": "Call-In Queue",
    "broadcast.joinQueue": "Join Queue",
    "broadcast.premiumGate.title": "Unlock Premium",
    "broadcast.premiumGate.description": "Get access to rewind, recording, and 48-hour past broadcast archives.",
    "broadcast.premiumGate.subscribe": "Subscribe — $4/month",
    "broadcast.premiumGate.later": "Maybe later",
    "broadcast.features.rewind": "Rewind live broadcasts to any point",
    "broadcast.features.record": "Record broadcasts to rewatch later",
    "broadcast.features.archive": "Access past broadcasts (48hr archive)",
    "broadcast.features.adFree": "Ad-free experience",
    "broadcast.features.priority": "Priority call-in queue",
  },
  es: {
    "nav.trends": "Tendencias",
    "nav.rankings": "Rankings",
    "nav.broadcasters": "Locutores",
    "nav.search": "Buscar",
    "nav.enterPulse": "Entrar al Pulso",
    "nav.lightMode": "Modo Claro",
    "nav.darkMode": "Modo Oscuro",
    "nav.language": "Idioma",
    "hero.badge": "TRANSMITIENDO AHORA — 47 PAÍSES",
    "hero.title1": "La Sala de Noticias",
    "hero.title2": "del Mundo.",
    "hero.title3": "En Tu",
    "hero.title4": "Bolsillo.",
    "hero.subtitle": "Desliza por las tendencias globales. Mira a los presentadores de IA comentar los titulares. Llama en vivo. Clasifica cada ciudad del planeta. Esto no son noticias — es el pulso del planeta.",
    "hero.cta1": "Entrar al Pulso",
    "hero.cta2": "Sintonizar en Vivo",
    "hero.stat1": "Países Clasificados",
    "hero.stat2": "Oyentes en Vivo",
    "hero.stat3": "Historias Hoy",
    "trending.label": "/// Lo Que Está Sonando Ahora",
    "trending.title1": "9 Categorías.",
    "trending.title2": "Buzz Infinito.",
    "trending.swipe": "Desliza para explorar cada categoría",
    "trending.exploreAll": "Explorar Todo",
    "trending.diveDeeper": "Profundizar",
    "rankings.label": "/// Rankings Globales",
    "rankings.title1": "Cada Ciudad. Cada País.",
    "rankings.title2": "Clasificado.",
    "rankings.subtitle": "De la más segura a la más peligrosa, del clima más caliente al más frío — profundiza desde lo global hasta tu vecindario.",
    "broadcast.label": "/// Sala de Locutores",
    "broadcast.title1": "Dos Presentadores IA. Llamadas en Vivo.",
    "broadcast.title2": "Tu Voz.",
    "broadcast.subtitle": "Conoce a Marcus (Americano) y Victoria (Británica) — tus presentadores de noticias con IA, personalidad y comentarios picantes. Llama en vivo para compartir tu opinión. 100 llamadas globales + 50 por país, todos los días.",
    "broadcast.liveNow": "EN VIVO",
    "broadcast.listening": "escuchando",
    "broadcast.callIn": "Cola de Llamadas",
    "broadcast.callInPrice": "Llamar — $0.99",
    "broadcast.callInDesc": "45-60 seg en vivo con presentador IA • Chat de texto gratis",
    "broadcast.countryRooms": "Salas por País",
    "broadcast.upcoming": "Próximamente:",
    "features.label": "/// Por Qué GlobalPulse",
    "features.title1": "Construido Diferente.",
    "features.title2": "Se Siente Diferente.",
    "pricing.label": "/// Elige Tu Pulso",
    "pricing.title1": "Gratis para Navegar.",
    "pricing.title2": "Premium para Dominar.",
    "pricing.free": "Gratis",
    "pricing.premium": "Premium",
    "pricing.callIn": "Llamada",
    "pricing.perMonth": "/mes",
    "pricing.perCall": "/llamada",
    "pricing.getStarted": "Comenzar Gratis",
    "pricing.goPremium": "Ir Premium",
    "pricing.buyCredits": "Comprar Créditos",
    "pricing.mostPopular": "MÁS POPULAR",
    "cta.title1": "El Mundo Está Hablando.",
    "cta.title2": "¿Estás Escuchando?",
    "cta.subtitle": "Únete a la lista de espera y sé el primero en experimentar GlobalPulse. Los primeros miembros obtienen Premium gratis por 3 meses.",
    "cta.placeholder": "Ingresa tu correo",
    "cta.joinWaitlist": "Unirse a la Lista",
    "cta.noSpam": "Sin spam. Cancela cuando quieras. Respetamos tu bandeja.",
    "footer.tagline": "La sala de noticias del mundo en tu bolsillo. Noticias trending, rankings globales, locutores IA y llamadas en vivo.",
    "footer.product": "Producto",
    "footer.company": "Empresa",
    "footer.legal": "Legal",
    "footer.connect": "Conectar",
    "footer.rights": "Todos los derechos reservados.",
    "trendsPage.title": "Todas las Tendencias",
    "trendsPage.subtitle": "De lo que el mundo está hablando ahora mismo. Clasificado por nivel de interés.",
    "trendsPage.all": "Todo",
    "trendsPage.rankings": "Clasificaciones",
    "trendsPage.stories": "Historias",
    "trendsPage.globalRankings": "CLASIFICACIONES GLOBALES",
    "trendsPage.live": "en vivo",
    "cat.crime": "Crimen",
    "cat.trending": "Tendencias",
    "cat.funny": "Divertido",
    "cat.entertainment": "Entretenimiento",
    "cat.celebrity": "Celebridades",
    "cat.gossip": "Chismes",
    "cat.weather": "Clima",
    "cat.business": "Negocios",
    "cat.sports": "Deportes",
    "broadcast.title": "Sala de Locutores",
    "broadcast.nav.live": "En Vivo",
    "broadcast.nav.schedule": "Horario",
    "broadcast.nav.past": "Transmisiones Pasadas",
    "broadcast.nav.rooms": "Salas por País",
    "broadcast.liveTranscript": "Transcripción en Vivo",
    "broadcast.callInQueue": "Cola de Llamadas",
    "broadcast.joinQueue": "Unirse a la Cola",
    "broadcast.premiumGate.title": "Desbloquear Premium",
    "broadcast.premiumGate.description": "Obtén acceso a rebobinar, grabar y archivos de las últimas 48 horas.",
    "broadcast.premiumGate.subscribe": "Suscribirse — $4/mes",
    "broadcast.premiumGate.later": "Quizás más tarde",
    "broadcast.features.rewind": "Rebobina transmisiones en vivo",
    "broadcast.features.record": "Graba para ver después",
    "broadcast.features.archive": "Acceso al archivo de 48 horas",
    "broadcast.features.adFree": "Experiencia sin anuncios",
    "broadcast.features.priority": "Prioridad en cola de llamadas",
  },
  fr: {
    "nav.trends": "Tendances",
    "nav.rankings": "Classements",
    "nav.broadcasters": "Présentateurs",
    "nav.search": "Rechercher",
    "nav.enterPulse": "Entrer dans le Pulse",
    "nav.lightMode": "Mode Clair",
    "nav.darkMode": "Mode Sombre",
    "nav.language": "Langue",
    "hero.badge": "EN DIRECT — 47 PAYS",
    "hero.title1": "La Salle de Rédaction",
    "hero.title2": "du Monde.",
    "hero.title3": "Dans Votre",
    "hero.title4": "Poche.",
    "hero.subtitle": "Parcourez les tendances mondiales. Regardez les présentateurs IA commenter les gros titres. Appelez en direct. Classez chaque ville de la planète. Ce ne sont pas des nouvelles — c'est le pouls de la planète.",
    "hero.cta1": "Entrer dans le Pulse",
    "hero.cta2": "Écouter en Direct",
    "hero.stat1": "Pays Classés",
    "hero.stat2": "Auditeurs en Direct",
    "hero.stat3": "Articles Aujourd'hui",
    "trending.label": "/// Ce Qui Buzz en Ce Moment",
    "trending.title1": "8 Catégories.",
    "trending.title2": "Buzz Infini.",
    "trending.swipe": "Glissez pour explorer chaque catégorie",
    "trending.exploreAll": "Tout Explorer",
    "trending.diveDeeper": "Approfondir",
    "rankings.label": "/// Classements Mondiaux",
    "rankings.title1": "Chaque Ville. Chaque Pays.",
    "rankings.title2": "Classé.",
    "rankings.subtitle": "De la plus sûre à la plus dangereuse, du climat le plus chaud au plus froid — explorez du global jusqu'à votre quartier.",
    "broadcast.label": "/// Salle des Présentateurs",
    "broadcast.title1": "Deux Présentateurs IA. Appels en Direct.",
    "broadcast.title2": "Votre Voix.",
    "broadcast.subtitle": "Rencontrez Marcus (Américain) et Victoria (Britannique) — vos présentateurs IA avec personnalité et commentaires piquants. Appelez en direct pour partager votre avis. 100 appels mondiaux + 50 par pays, chaque jour.",
    "broadcast.liveNow": "EN DIRECT",
    "broadcast.listening": "à l'écoute",
    "broadcast.callIn": "File d'Appels",
    "broadcast.callInPrice": "Appeler — 0,99$",
    "broadcast.callInDesc": "45-60 sec en direct avec présentateur IA • Chat texte gratuit",
    "broadcast.countryRooms": "Salles par Pays",
    "broadcast.upcoming": "À venir :",
    "features.label": "/// Pourquoi GlobalPulse",
    "features.title1": "Construit Différemment.",
    "features.title2": "Ressenti Différemment.",
    "pricing.label": "/// Choisissez Votre Pulse",
    "pricing.title1": "Gratuit pour Naviguer.",
    "pricing.title2": "Premium pour Dominer.",
    "pricing.free": "Gratuit",
    "pricing.premium": "Premium",
    "pricing.callIn": "Appel",
    "pricing.perMonth": "/mois",
    "pricing.perCall": "/appel",
    "pricing.getStarted": "Commencer Gratuitement",
    "pricing.goPremium": "Passer Premium",
    "pricing.buyCredits": "Acheter des Crédits",
    "pricing.mostPopular": "LE PLUS POPULAIRE",
    "cta.title1": "Le Monde Parle.",
    "cta.title2": "Vous Écoutez ?",
    "cta.subtitle": "Rejoignez la liste d'attente et soyez le premier à découvrir GlobalPulse. Les premiers membres obtiennent Premium gratuit pendant 3 mois.",
    "cta.placeholder": "Entrez votre email",
    "cta.joinWaitlist": "Rejoindre la Liste",
    "cta.noSpam": "Pas de spam. Désabonnez-vous à tout moment.",
    "footer.tagline": "La salle de rédaction du monde dans votre poche. Tendances, classements mondiaux, présentateurs IA et appels en direct.",
    "footer.product": "Produit",
    "footer.company": "Entreprise",
    "footer.legal": "Mentions Légales",
    "footer.connect": "Connexion",
    "footer.rights": "Tous droits réservés.",
    "trendsPage.title": "Toutes les Tendances",
    "trendsPage.subtitle": "Ce dont le monde parle en ce moment. Classé par score de chaleur.",
    "trendsPage.all": "Tout",
    "trendsPage.rankings": "Classements",
    "trendsPage.stories": "Histoires",
    "trendsPage.globalRankings": "CLASSEMENTS MONDIAUX",
    "trendsPage.live": "en direct",
    "cat.crime": "Crime",
    "cat.trending": "Tendances",
    "cat.funny": "Drôle",
    "cat.entertainment": "Divertissement",
    "cat.celebrity": "Célébrités",
    "cat.gossip": "Potins",
    "cat.weather": "Météo",
    "cat.business": "Affaires",
    "cat.sports": "Sports",
    "broadcast.title": "Salle des Présentateurs",
    "broadcast.nav.live": "En Direct",
    "broadcast.nav.schedule": "Programme",
    "broadcast.nav.past": "Archives",
    "broadcast.nav.rooms": "Salons Pays",
    "broadcast.liveTranscript": "Transcription en Direct",
    "broadcast.callInQueue": "File d'Attente",
    "broadcast.joinQueue": "Rejoindre la File",
    "broadcast.premiumGate.title": "Débloquer Premium",
    "broadcast.premiumGate.description": "Accédez au rembobinage, à l'enregistrement et aux archives des 48 dernières heures.",
    "broadcast.premiumGate.subscribe": "S'abonner — 4 $/mois",
    "broadcast.premiumGate.later": "Plus tard",
    "broadcast.features.rewind": "Rembobiner le direct à tout moment",
    "broadcast.features.record": "Enregistrer pour regarder plus tard",
    "broadcast.features.archive": "Accès aux archives (48h)",
    "broadcast.features.adFree": "Expérience sans publicité",
    "broadcast.features.priority": "Priorité pour les appels",
  },
  hi: {
    "nav.trends": "ट्रेंड्स",
    "nav.rankings": "रैंकिंग",
    "nav.broadcasters": "ब्रॉडकास्टर्स",
    "nav.search": "खोजें",
    "nav.enterPulse": "पल्स में प्रवेश करें",
    "nav.lightMode": "लाइट मोड",
    "nav.darkMode": "डार्क मोड",
    "nav.language": "भाषा",
    "hero.badge": "अभी प्रसारण — 47 देश",
    "hero.title1": "दुनिया का",
    "hero.title2": "न्यूज़रूम।",
    "hero.title3": "आपकी",
    "hero.title4": "जेब में।",
    "hero.subtitle": "वैश्विक ट्रेंड्स स्वाइप करें। AI एंकर्स को हेडलाइंस पर कमेंट करते देखें। लाइव कॉल करें। पृथ्वी के हर शहर को रैंक करें। यह खबर नहीं है — यह ग्रह की धड़कन है।",
    "hero.cta1": "पल्स में प्रवेश करें",
    "hero.cta2": "लाइव सुनें",
    "hero.stat1": "देश रैंक किए गए",
    "hero.stat2": "लाइव श्रोता",
    "hero.stat3": "आज की खबरें",
    "trending.label": "/// अभी क्या चल रहा है",
    "trending.title1": "8 श्रेणियाँ।",
    "trending.title2": "अनंत बज़।",
    "trending.swipe": "हर श्रेणी को एक्सप्लोर करने के लिए स्वाइप करें",
    "trending.exploreAll": "सब एक्सप्लोर करें",
    "trending.diveDeeper": "गहराई में जाएं",
    "rankings.label": "/// वैश्विक रैंकिंग",
    "rankings.title1": "हर शहर। हर देश।",
    "rankings.title2": "रैंक किया गया।",
    "rankings.subtitle": "सबसे सुरक्षित से सबसे खतरनाक तक, सबसे गर्म मौसम से सबसे ठंडे तक — वैश्विक से अपने मोहल्ले तक।",
    "broadcast.label": "/// ब्रॉडकास्टर्स रूम",
    "broadcast.title1": "दो AI एंकर। लाइव कॉल-इन।",
    "broadcast.title2": "आपकी आवाज़।",
    "broadcast.subtitle": "Marcus (अमेरिकी) और Victoria (ब्रिटिश) से मिलें — आपके AI न्यूज़ एंकर। लाइव कॉल करें। 100 वैश्विक कॉल + 50 प्रति देश, हर दिन।",
    "broadcast.liveNow": "लाइव",
    "broadcast.listening": "सुन रहे हैं",
    "broadcast.callIn": "कॉल-इन कतार",
    "broadcast.callInPrice": "कॉल करें — $0.99",
    "broadcast.callInDesc": "AI एंकर के साथ 45-60 सेकंड लाइव • मुफ्त टेक्स्ट चैट",
    "broadcast.countryRooms": "देश के कमरे",
    "broadcast.upcoming": "आगामी:",
    "features.label": "/// GlobalPulse क्यों",
    "features.title1": "अलग बनाया गया।",
    "features.title2": "अलग महसूस होता है।",
    "pricing.label": "/// अपना पल्स चुनें",
    "pricing.title1": "ब्राउज़ करने के लिए मुफ्त।",
    "pricing.title2": "हावी होने के लिए प्रीमियम।",
    "pricing.free": "मुफ्त",
    "pricing.premium": "प्रीमियम",
    "pricing.callIn": "कॉल-इन",
    "pricing.perMonth": "/माह",
    "pricing.perCall": "/कॉल",
    "pricing.getStarted": "मुफ्त शुरू करें",
    "pricing.goPremium": "प्रीमियम लें",
    "pricing.buyCredits": "क्रेडिट खरीदें",
    "pricing.mostPopular": "सबसे लोकप्रिय",
    "cta.title1": "दुनिया बात कर रही है।",
    "cta.title2": "क्या आप सुन रहे हैं?",
    "cta.subtitle": "वेटलिस्ट में शामिल हों और GlobalPulse का अनुभव करने वाले पहले बनें। शुरुआती सदस्यों को 3 महीने मुफ्त प्रीमियम।",
    "cta.placeholder": "अपना ईमेल दर्ज करें",
    "cta.joinWaitlist": "वेटलिस्ट में शामिल हों",
    "cta.noSpam": "कोई स्पैम नहीं। कभी भी अनसब्सक्राइब करें।",
    "footer.tagline": "आपकी जेब में दुनिया का न्यूज़रूम। ट्रेंडिंग न्यूज़, वैश्विक रैंकिंग, AI ब्रॉडकास्टर्स और लाइव कॉल-इन।",
    "footer.product": "उत्पाद",
    "footer.company": "कंपनी",
    "footer.legal": "कानूनी",
    "footer.connect": "जुड़ें",
    "footer.rights": "सर्वाधिकार सुरक्षित।",
    "trendsPage.title": "सभी ट्रेंड्स",
    "trendsPage.subtitle": "दुनिया अभी किस बारे में बात कर रही है। हीट स्कोर द्वारा रैंक किया गया।",
    "trendsPage.all": "सभी",
    "trendsPage.rankings": "रैंकिंग",
    "trendsPage.stories": "कहानियाँ",
    "trendsPage.globalRankings": "वैश्विक रैंकिंग",
    "trendsPage.live": "लाइव",
    "cat.crime": "अपराध",
    "cat.trending": "ट्रेंडिंग",
    "cat.funny": "मज़ेदार",
    "cat.entertainment": "मनोरंजन",
    "cat.celebrity": "सेलिब्रिटी",
    "cat.gossip": "गपशप",
    "cat.weather": "मौसम",
    "cat.business": "व्यापार",
    "cat.sports": "खेल",
    "broadcast.title": "ब्रॉडकास्टर्स रूम",
    "broadcast.nav.live": "अभी लाइव",
    "broadcast.nav.schedule": "शेड्यूल",
    "broadcast.nav.past": "पुराने ब्रॉडकास्ट",
    "broadcast.nav.rooms": "देश के कमरे",
    "broadcast.liveTranscript": "लाइव ट्रांसक्रिप्ट",
    "broadcast.callInQueue": "कॉल-इन कतार",
    "broadcast.joinQueue": "कतार में शामिल हों",
    "broadcast.premiumGate.title": "प्रीमियम अनलॉक करें",
    "broadcast.premiumGate.description": "रिवाइंड, रिकॉर्डिंग और 48 घंटे के पुराने ब्रॉडकास्ट आर्काइव तक पहुंच प्राप्त करें।",
    "broadcast.premiumGate.subscribe": "सब्सक्राइब करें — $4/माह",
    "broadcast.premiumGate.later": "शायद बाद में",
    "broadcast.features.rewind": "लाइव ब्रॉडकास्ट को किसी भी पॉइंट पर रिवाइंड करें",
    "broadcast.features.record": "बाद में देखने के लिए रिकॉर्ड करें",
    "broadcast.features.archive": "48 घंटे का आर्काइव एक्सेस",
    "broadcast.features.adFree": "विज्ञापन-मुक्त अनुभव",
    "broadcast.features.priority": "कॉल-इन कतार में प्राथमिकता",
  },
  pt: {
    "nav.trends": "Tendências",
    "nav.rankings": "Rankings",
    "nav.broadcasters": "Locutores",
    "nav.search": "Buscar",
    "nav.enterPulse": "Entrar no Pulse",
    "nav.lightMode": "Modo Claro",
    "nav.darkMode": "Modo Escuro",
    "nav.language": "Idioma",
    "hero.badge": "TRANSMITINDO AGORA — 47 PAÍSES",
    "hero.title1": "A Redação",
    "hero.title2": "do Mundo.",
    "hero.title3": "No Seu",
    "hero.title4": "Bolso.",
    "hero.subtitle": "Deslize pelas tendências globais. Assista âncoras de IA comentarem as manchetes. Ligue ao vivo. Classifique cada cidade do planeta. Isso não é notícia — é o pulso do planeta.",
    "hero.cta1": "Entrar no Pulse",
    "hero.cta2": "Sintonizar ao Vivo",
    "hero.stat1": "Países Classificados",
    "hero.stat2": "Ouvintes ao Vivo",
    "hero.stat3": "Matérias Hoje",
    "trending.label": "/// O Que Está Bombando Agora",
    "trending.title1": "9 Categorias.",
    "trending.title2": "Buzz Infinito.",
    "trending.swipe": "Deslize para explorar cada categoria",
    "trending.exploreAll": "Explorar Tudo",
    "trending.diveDeeper": "Aprofundar",
    "rankings.label": "/// Rankings Globais",
    "rankings.title1": "Cada Cidade. Cada País.",
    "rankings.title2": "Classificado.",
    "rankings.subtitle": "Da mais segura à mais perigosa, do clima mais quente ao mais frio — explore do global até seu bairro.",
    "broadcast.label": "/// Sala dos Locutores",
    "broadcast.title1": "Dois Âncoras IA. Chamadas ao Vivo.",
    "broadcast.title2": "Sua Voz.",
    "broadcast.subtitle": "Conheça Marcus (Americano) e Victoria (Britânica) — seus âncoras de IA com personalidade e comentários picantes. Ligue ao vivo. 100 chamadas globais + 50 por país, todos os dias.",
    "broadcast.liveNow": "AO VIVO",
    "broadcast.listening": "ouvindo",
    "broadcast.callIn": "Fila de Chamadas",
    "broadcast.callInPrice": "Ligar — $0,99",
    "broadcast.callInDesc": "45-60 seg ao vivo com âncora IA • Chat de texto grátis",
    "broadcast.countryRooms": "Salas por País",
    "broadcast.upcoming": "Em breve:",
    "features.label": "/// Por Que GlobalPulse",
    "features.title1": "Construído Diferente.",
    "features.title2": "Sente Diferente.",
    "pricing.label": "/// Escolha Seu Pulse",
    "pricing.title1": "Grátis para Navegar.",
    "pricing.title2": "Premium para Dominar.",
    "pricing.free": "Grátis",
    "pricing.premium": "Premium",
    "pricing.callIn": "Chamada",
    "pricing.perMonth": "/mês",
    "pricing.perCall": "/chamada",
    "pricing.getStarted": "Começar Grátis",
    "pricing.goPremium": "Ir Premium",
    "pricing.buyCredits": "Comprar Créditos",
    "pricing.mostPopular": "MAIS POPULAR",
    "cta.title1": "O Mundo Está Falando.",
    "cta.title2": "Você Está Ouvindo?",
    "cta.subtitle": "Entre na lista de espera e seja o primeiro a experimentar o GlobalPulse. Membros iniciais ganham Premium grátis por 3 meses.",
    "cta.placeholder": "Digite seu email",
    "cta.joinWaitlist": "Entrar na Lista",
    "cta.noSpam": "Sem spam. Cancele quando quiser.",
    "footer.tagline": "A redação do mundo no seu bolso. Notícias trending, rankings globais, locutores IA e chamadas ao vivo.",
    "footer.product": "Produto",
    "footer.company": "Empresa",
    "footer.legal": "Legal",
    "footer.connect": "Conectar",
    "footer.rights": "Todos os direitos reservados.",
    "trendsPage.title": "Todas as Tendências",
    "trendsPage.subtitle": "O que o mundo está comentando agora. Classificado por pontuação de calor.",
    "trendsPage.all": "Tudo",
    "trendsPage.rankings": "Rankings",
    "trendsPage.stories": "Histórias",
    "trendsPage.globalRankings": "RANKINGS GLOBAIS",
    "trendsPage.live": "ao vivo",
    "cat.crime": "Crime",
    "cat.trending": "Tendências",
    "cat.funny": "Engraçado",
    "cat.entertainment": "Entretenimento",
    "cat.celebrity": "Celebridades",
    "cat.gossip": "Fofoca",
    "cat.weather": "Clima",
    "cat.business": "Negócios",
    "cat.sports": "Esportes",
    "broadcast.title": "Sala de Transmissão",
    "broadcast.nav.live": "Ao Vivo",
    "broadcast.nav.schedule": "Programação",
    "broadcast.nav.past": "Transmissões Passadas",
    "broadcast.nav.rooms": "Salas por País",
    "broadcast.liveTranscript": "Transcrição ao Vivo",
    "broadcast.callInQueue": "Fila de Chamadas",
    "broadcast.joinQueue": "Entrar na Fila",
    "broadcast.premiumGate.title": "Desbloquear Premium",
    "broadcast.premiumGate.description": "Tenha acesso a retroceder, gravar e arquivos das últimas 48 horas.",
    "broadcast.premiumGate.subscribe": "Assinar — $4/mês",
    "broadcast.premiumGate.later": "Talvez depois",
    "broadcast.features.rewind": "Retroceder transmissões ao vivo",
    "broadcast.features.record": "Gravar para assistir depois",
    "broadcast.features.archive": "Arquivo de 48 horas",
    "broadcast.features.adFree": "Experiência sem anúncios",
    "broadcast.features.priority": "Prioridade na fila de chamadas",
  },
  ar: {
    "nav.trends": "الاتجاهات",
    "nav.rankings": "التصنيفات",
    "nav.broadcasters": "المذيعون",
    "nav.search": "بحث",
    "nav.enterPulse": "ادخل النبض",
    "nav.lightMode": "الوضع الفاتح",
    "nav.darkMode": "الوضع الداكن",
    "nav.language": "اللغة",
    "hero.badge": "يُبث الآن — 47 دولة",
    "hero.title1": "غرفة أخبار",
    "hero.title2": "العالم.",
    "hero.title3": "في",
    "hero.title4": "جيبك.",
    "hero.subtitle": "تصفح الاتجاهات العالمية. شاهد مذيعي الذكاء الاصطناعي يعلقون على العناوين. اتصل مباشرة. صنف كل مدينة على الأرض.",
    "hero.cta1": "ادخل النبض",
    "hero.cta2": "استمع مباشرة",
    "hero.stat1": "دول مصنفة",
    "hero.stat2": "مستمعون مباشرون",
    "hero.stat3": "أخبار اليوم",
    "trending.label": "/// ما الذي يطن الآن",
    "trending.title1": "8 فئات.",
    "trending.title2": "ضجة لا نهائية.",
    "trending.swipe": "اسحب لاستكشاف كل فئة",
    "trending.exploreAll": "استكشاف الكل",
    "trending.diveDeeper": "تعمق أكثر",
    "rankings.label": "/// التصنيفات العالمية",
    "rankings.title1": "كل مدينة. كل دولة.",
    "rankings.title2": "مصنفة.",
    "rankings.subtitle": "من الأكثر أماناً إلى الأكثر خطورة، من أحر طقس إلى أبرده — تعمق من العالمي إلى حيك.",
    "broadcast.label": "/// غرفة المذيعين",
    "broadcast.title1": "مذيعان بالذكاء الاصطناعي. مكالمات مباشرة.",
    "broadcast.title2": "صوتك.",
    "broadcast.subtitle": "تعرف على ماركوس (أمريكي) وفيكتوريا (بريطانية) — مذيعو أخبار الذكاء الاصطناعي. اتصل مباشرة. 100 مكالمة عالمية + 50 لكل دولة يومياً.",
    "broadcast.liveNow": "مباشر الآن",
    "broadcast.listening": "يستمعون",
    "broadcast.callIn": "طابور المكالمات",
    "broadcast.callInPrice": "اتصل — $0.99",
    "broadcast.callInDesc": "45-60 ثانية مباشرة مع مذيع IA • دردشة نصية مجانية",
    "broadcast.countryRooms": "غرف الدول",
    "broadcast.upcoming": "قادم:",
    "features.label": "/// لماذا GlobalPulse",
    "features.title1": "بُني بشكل مختلف.",
    "features.title2": "يشعر بشكل مختلف.",
    "pricing.label": "/// اختر نبضك",
    "pricing.title1": "مجاني للتصفح.",
    "pricing.title2": "بريميوم للسيطرة.",
    "pricing.free": "مجاني",
    "pricing.premium": "بريميوم",
    "pricing.callIn": "مكالمة",
    "pricing.perMonth": "/شهر",
    "pricing.perCall": "/مكالمة",
    "pricing.getStarted": "ابدأ مجاناً",
    "pricing.goPremium": "انتقل للبريميوم",
    "pricing.buyCredits": "شراء رصيد",
    "pricing.mostPopular": "الأكثر شعبية",
    "cta.title1": "العالم يتحدث.",
    "cta.title2": "هل تستمع؟",
    "cta.subtitle": "انضم لقائمة الانتظار وكن أول من يجرب GlobalPulse. الأعضاء الأوائل يحصلون على بريميوم مجاني لمدة 3 أشهر.",
    "cta.placeholder": "أدخل بريدك الإلكتروني",
    "cta.joinWaitlist": "انضم للقائمة",
    "cta.noSpam": "بدون رسائل مزعجة. إلغاء الاشتراك في أي وقت.",
    "footer.tagline": "غرفة أخبار العالم في جيبك. أخبار رائجة، تصنيفات عالمية، مذيعون بالذكاء الاصطناعي ومكالمات مباشرة.",
    "footer.product": "المنتج",
    "footer.company": "الشركة",
    "footer.legal": "قانوني",
    "footer.connect": "تواصل",
    "footer.rights": "جميع الحقوق محفوظة.",
    "trendsPage.title": "كل الاتجاهات",
    "trendsPage.subtitle": "ما يتحدث عنه العالم الآن. مصنفة حسب درجة الاهتمام.",
    "trendsPage.all": "الكل",
    "trendsPage.rankings": "التصنيفات",
    "trendsPage.stories": "القصص",
    "trendsPage.globalRankings": "التصنيفات العالمية",
    "trendsPage.live": "مباشر",
    "cat.crime": "جريمة",
    "cat.trending": "رائج",
    "cat.funny": "مضحك",
    "cat.entertainment": "ترفيه",
    "cat.celebrity": "مشاهير",
    "cat.gossip": "شائعات",
    "cat.weather": "الطقس",
    "cat.business": "أعمال",
    "cat.sports": "رياضة",
    "broadcast.title": "غرفة المذيعين",
    "broadcast.nav.live": "مباشر الآن",
    "broadcast.nav.schedule": "الجدول",
    "broadcast.nav.past": "البث المباشر السابق",
    "broadcast.nav.rooms": "غرف الدول",
    "broadcast.liveTranscript": "النص المباشر",
    "broadcast.callInQueue": "طابور المكالمات",
    "broadcast.joinQueue": "انضم للطابور",
    "broadcast.premiumGate.title": "فتح النسخة المميزة",
    "broadcast.premiumGate.description": "احصل على ميزات الترجيع، التسجيل، وأرشيف البث لآخر 48 ساعة.",
    "broadcast.premiumGate.subscribe": "اشترك — 4$ شهرياً",
    "broadcast.premiumGate.later": "ربما لاحقاً",
    "broadcast.features.rewind": "ترجيع البث المباشر لأي نقطة",
    "broadcast.features.record": "تسجيل البث للمشاهدة لاحقاً",
    "broadcast.features.archive": "الوصول للأرشيف (48 ساعة)",
    "broadcast.features.adFree": "تجربة خالية من الإعلانات",
    "broadcast.features.priority": "أولوية في طابور المكالمات",
  },
  zh: {
    "nav.trends": "趋势",
    "nav.rankings": "排名",
    "nav.broadcasters": "主播",
    "nav.search": "搜索",
    "nav.enterPulse": "进入脉搏",
    "nav.lightMode": "浅色模式",
    "nav.darkMode": "深色模式",
    "nav.language": "语言",
    "hero.badge": "正在直播 — 47个国家",
    "hero.title1": "全球",
    "hero.title2": "新闻室。",
    "hero.title3": "在你的",
    "hero.title4": "口袋里。",
    "hero.subtitle": "滑动浏览全球趋势。观看AI主播点评头条新闻。实时拨打电话。为地球上每个城市排名。这不是新闻——这是地球的脉搏。",
    "hero.cta1": "进入脉搏",
    "hero.cta2": "实时收听",
    "hero.stat1": "已排名国家",
    "hero.stat2": "实时听众",
    "hero.stat3": "今日新闻",
    "trending.label": "/// 现在热门话题",
    "trending.title1": "8个类别。",
    "trending.title2": "无限热度。",
    "trending.swipe": "滑动探索每个类别",
    "trending.exploreAll": "探索全部",
    "trending.diveDeeper": "深入了解",
    "rankings.label": "/// 全球排名",
    "rankings.title1": "每个城市。每个国家。",
    "rankings.title2": "已排名。",
    "rankings.subtitle": "从最安全到最危险，从最热到最冷——从全球深入到你的社区。",
    "broadcast.label": "/// 主播室",
    "broadcast.title1": "两位AI主播。实时来电。",
    "broadcast.title2": "你的声音。",
    "broadcast.subtitle": "认识Marcus（美国口音）和Victoria（英国口音）——你的AI新闻主播。实时拨打电话。每天100个全球电话+每个国家50个。",
    "broadcast.liveNow": "正在直播",
    "broadcast.listening": "正在收听",
    "broadcast.callIn": "来电队列",
    "broadcast.callInPrice": "拨打 — $0.99",
    "broadcast.callInDesc": "与AI主播实时通话45-60秒 • 免费文字聊天",
    "broadcast.countryRooms": "国家频道",
    "broadcast.upcoming": "即将播出：",
    "features.label": "/// 为什么选择GlobalPulse",
    "features.title1": "与众不同的构建。",
    "features.title2": "与众不同的体验。",
    "pricing.label": "/// 选择你的脉搏",
    "pricing.title1": "免费浏览。",
    "pricing.title2": "高级版主宰。",
    "pricing.free": "免费",
    "pricing.premium": "高级版",
    "pricing.callIn": "来电",
    "pricing.perMonth": "/月",
    "pricing.perCall": "/次",
    "pricing.getStarted": "免费开始",
    "pricing.goPremium": "升级高级版",
    "pricing.buyCredits": "购买积分",
    "pricing.mostPopular": "最受欢迎",
    "cta.title1": "世界在说话。",
    "cta.title2": "你在听吗？",
    "cta.subtitle": "加入等候名单，成为第一个体验GlobalPulse的人。早期会员免费获得3个月高级版。",
    "cta.placeholder": "输入你的邮箱",
    "cta.joinWaitlist": "加入等候名单",
    "cta.noSpam": "无垃圾邮件。随时取消订阅。",
    "footer.tagline": "口袋里的全球新闻室。热门新闻、全球排名、AI主播和实时来电。",
    "footer.product": "产品",
    "footer.company": "公司",
    "footer.legal": "法律",
    "footer.connect": "联系",
    "footer.rights": "版权所有。",
    "trendsPage.title": "所有趋势",
    "trendsPage.subtitle": "世界现在正在热议什么。按热度评分排名。",
    "trendsPage.all": "全部",
    "trendsPage.rankings": "排名",
    "trendsPage.stories": "故事",
    "trendsPage.globalRankings": "全球排名",
    "trendsPage.live": "直播",
    "cat.crime": "犯罪",
    "cat.trending": "热门",
    "cat.funny": "搞笑",
    "cat.entertainment": "娱乐",
    "cat.celebrity": "名人",
    "cat.gossip": "八卦",
    "cat.weather": "天气",
    "cat.business": "商业",
    "cat.sports": "体育",
    "broadcast.title": "主播室",
    "broadcast.nav.live": "正在直播",
    "broadcast.nav.schedule": "节目表",
    "broadcast.nav.past": "往期回顾",
    "broadcast.nav.rooms": "国家频道",
    "broadcast.liveTranscript": "实时转录",
    "broadcast.callInQueue": "通话排队",
    "broadcast.joinQueue": "加入排队",
    "broadcast.premiumGate.title": "解锁高级版",
    "broadcast.premiumGate.description": "获得倒回、录制和 48 小时往期广播存档的权限。",
    "broadcast.premiumGate.subscribe": "订阅 — 每月 $4",
    "broadcast.premiumGate.later": "稍后再说",
    "broadcast.features.rewind": "随时倒回直播内容",
    "broadcast.features.record": "录制广播内容以便稍后观看",
    "broadcast.features.archive": "访问 48 小时存档",
    "broadcast.features.adFree": "无广告体验",
    "broadcast.features.priority": "通话排队优先权",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("gp-language");
    if (stored) {
      const found = LANGUAGES.find((l) => l.code === stored);
      if (found) return found;
    }
    return LANGUAGES[0]; // English default
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("gp-language", lang.code);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const langTranslations = translations[language.code];
      if (langTranslations && key in langTranslations) {
        return langTranslations[key as keyof TranslationKeys];
      }
      // Fallback to English
      const enTranslations = translations["en"];
      if (enTranslations && key in enTranslations) {
        return enTranslations[key as keyof TranslationKeys];
      }
      return key;
    },
    [language.code]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
