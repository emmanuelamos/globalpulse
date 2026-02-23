import { useEffect } from "react";

const OG_IMAGES: Record<string, string> = {
  main: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/jLXxGOFOrozkoOeP.jpg",
  crime: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/mKpSXsrJmfJjZrru.jpg",
  trending: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/nWFFsluugfdZZoGi.jpg",
  funny: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/YTVFqeRjVCNvUyEy.jpg",
  entertainment: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/HFThpKzvNqeeFRUE.jpg",
  celebrity: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/SxCHsPrqZfRkaYXr.jpg",
  gossip: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/ibUaIJxrnjwUOJta.jpg",
  weather: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/lozzPDKXTaepOkCB.jpg",
  business: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/SODCCVfaBFPTYfYq.jpg",
  sports: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663275702708/nXtvXEYSxfdOJaUq.jpg",
};

const OG_DESCRIPTIONS: Record<string, string> = {
  main: "The world's first AI-powered trending news platform. 9 categories. Every country ranked. Live AI broadcasters. The world is buzzing — are you tuned in?",
  crime: "Top 10 crime rankings by country, state, and city. Real-time crime data, AI-summarized reports, and global safety scores. Who's watching?",
  trending: "What the world can't stop talking about. Trending stories ranked globally and by country. AI-curated, real-time, and addictive.",
  funny: "The internet's funniest moments — ranked by country. Viral fails, meme wars, and comedy gold. Which country is winning the laugh race?",
  entertainment: "Movies. Music. Shows. All ranked by country. The hottest entertainment buzz from every corner of the globe.",
  celebrity: "Who's making headlines? Celebrity news ranked by country. Red carpet drama, scandals, and star power — all tracked in real time.",
  gossip: "The tea is served. Globally ranked. The juiciest gossip from every country, AI-curated and ranked by buzz volume.",
  weather: "Hottest. Coldest. Wildest. Ranked. Extreme weather events tracked globally. Which country is breaking temperature records today?",
  business: "Markets. Crypto. Startups. All ranked. Stock surges, Bitcoin moves, and the hottest new apps — ranked by country in real time.",
  sports: "NFL. Premier League. NBA. F1. UFC. Tennis. Every sport ranked by country. Live scores, AI summaries, and global sports dominance tracked in real time.",
};

const OG_TITLES: Record<string, string> = {
  main: "GlobalPulse — The World is Buzzing",
  crime: "GlobalPulse — Crime Rankings",
  trending: "GlobalPulse — Trending Now",
  funny: "GlobalPulse — Funny Rankings",
  entertainment: "GlobalPulse — Entertainment Buzz",
  celebrity: "GlobalPulse — Celebrity Tracker",
  gossip: "GlobalPulse — Gossip Wire",
  weather: "GlobalPulse — Weather Extremes",
  business: "GlobalPulse — Business Surge",
  sports: "GlobalPulse — Sports Arena",
};

interface OGMetaProps {
  category?: string;
  title?: string;
  description?: string;
  image?: string;
}

function setMetaTag(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setNameMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function OGMeta({ category = "main", title, description, image }: OGMetaProps) {
  useEffect(() => {
    const cat = category.toLowerCase();
    const ogImage = image || OG_IMAGES[cat] || OG_IMAGES.main;
    const ogDescription = description || OG_DESCRIPTIONS[cat] || OG_DESCRIPTIONS.main;
    const ogTitle = title || OG_TITLES[cat] || OG_TITLES.main;

    document.title = ogTitle;

    // Open Graph
    setMetaTag("og:title", ogTitle);
    setMetaTag("og:description", ogDescription);
    setMetaTag("og:image", ogImage);
    setMetaTag("og:image:width", "1200");
    setMetaTag("og:image:height", "630");
    setMetaTag("og:type", "website");
    setMetaTag("og:site_name", "GlobalPulse");

    // Twitter Card
    setNameMetaTag("twitter:card", "summary_large_image");
    setNameMetaTag("twitter:title", ogTitle);
    setNameMetaTag("twitter:description", ogDescription);
    setNameMetaTag("twitter:image", ogImage);

    // General description
    setNameMetaTag("description", ogDescription);
  }, [category, title, description, image]);

  return null;
}

export { OG_IMAGES, OG_DESCRIPTIONS, OG_TITLES };
