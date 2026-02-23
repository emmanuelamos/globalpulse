import axios from "axios";
import dotenv from "dotenv";
import { getDb } from "./server/db"; 
import { stories } from "./drizzle/schema"; // Based on your import list

dotenv.config();

async function syncToTiDB() {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return console.error("Missing NEWS_API_KEY");

  // 1. Initialize the Database
  const db = await getDb();
  if (!db) return console.error("Could not connect to TiDB. Check DATABASE_URL in .env");

  try {
    console.log("Fetching live news...");
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?language=en&apiKey=${apiKey}`);
    const articles = response.data.articles;

    console.log(`Inserting ${articles.length} stories into TiDB...`);

    for (const article of articles) {
        try {
          await db.insert(stories).values({
            title: article.title || "No Title",
            summary: article.description || "No summary available",
            sourceUrl: article.url || "",           // Changed from 'url'
            sourceName: article.source.name || "",  // Changed from 'source'
            imageUrl: article.urlToImage || "",
            category: "trending",                   // Matches one of your mysqlEnum values
            heatScore: 95,
            publishedAt: new Date(article.publishedAt),
            country: "US",                          // Optional: your schema allows 3 chars
          });
        } catch (err) {
          console.error(`Skipping story "${article.title}" due to error:`, err);
        }
      }

    console.log("✅ TiDB updated! Refresh http://localhost:3000 now.");
  } catch (e) {
    console.error("Database sync failed:", e);
  }
}

syncToTiDB();