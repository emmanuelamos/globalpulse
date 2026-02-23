# GlobalPulse PWA — TODO

## Landing Page (Complete)
- [x] Hero section with globe visual and animated counters
- [x] Scrolling breaking news ticker
- [x] 8 trending news categories (Crime, Trending, Funny, Entertainment, Celebrity, Gossip, Weather, Business)
- [x] Rankings dashboard with 8 ranking types
- [x] Broadcasters Room preview with dual AI anchors (Marcus + Victoria)
- [x] Features grid
- [x] Pricing section (Free / Premium / Call-In)
- [x] CTA with email waitlist capture
- [x] Footer
- [x] Dark/light mode toggle
- [x] Language selector (25 languages)

## Full-Stack Upgrade
- [x] Database, user accounts, backend server
- [x] Database schema for stories, rankings, comments, likes, waitlist
- [x] Push database migrations

## Inner App Pages
- [x] Trends Feed page (all 8 categories, story cards, AI summaries)
- [x] Business drill-down page (Stocks, Crypto, Trending Apps, Startups, Products)
- [x] Rankings drill-down page (global → country → city hierarchy)
- [x] Broadcasters Room full page (dual anchors, call-in queue, country rooms, live chat)
- [x] Search page (type "Entertainment Canada" → instant results)
- [x] User Profile / Settings page

## Core Features
- [x] Waitlist email collection (saves to database)
- [x] Likes, comments, replies on stories
- [x] Notification preferences
- [x] PWA manifest + service worker for install & offline

## Monetization
- [x] Stripe integration for Premium ($4/mo)
- [x] Stripe integration for Call-In ($0.99)
- [x] Free vs Premium gating logic

## Polish
- [x] Navigation routing between all pages
- [x] Responsive design testing
- [x] Final testing and checkpoint

## Broadcasters Room Features
- [x] Live CC/subtitles toggle in any of 25 supported languages
- [x] Subscriber recording of live broadcasts to rewatch
- [x] Subscriber rewind to any point during live broadcast
- [x] Past broadcasts archive (48hr retention, auto-cleared)
- [x] Free vs Premium gating: non-subscribers cannot rewind or view past broadcasts

## Rankings in Every Category (Core USP)
- [x] Create CategoryRankings component — reusable Global Top 10-20 → Country → State → City drill-down
- [x] Add rankings mock data for all 8 categories with country/state/city hierarchy
- [x] Integrate rankings into Trends Feed — each category shows rankings tab
- [x] Integrate rankings into Business page — stocks/crypto/apps ranked by country
- [x] Create dedicated CategoryRankingPage route for deep drill-down
- [x] Ensure all category cards link to rankings view

## Logo & Branding
- [x] Design GlobalPulse logo (cyberpunk neon broadcast style)
- [x] Create favicon variants (16x16, 32x32, 192x192, 512x512)
- [x] Integrate logo into navbar, footer, PWA manifest, and Open Graph meta

## Fixes
- [x] Ticker bar: add Business headlines to rotation (cover all 8 categories)
- [x] Category count: change "7 Categories" to "8 Categories"
- [x] Description text: add Business/stocks/crypto buzz line

## New Standalone Pages (no API needed)
- [x] Contact page (broadcasting/newsroom vibe)
- [x] Register/Sign-up page with social logins and email
- [x] About page (mission, team, story — news broadcast style)
- [x] FAQ page (broadcast-themed Q&A)
- [x] Add all new routes to App.tsx

## Final Pre-API Build
- [x] Privacy Policy page (broadcast style)
- [x] Terms of Service page (broadcast style)
- [x] Push notification system (backend + frontend preferences)
- [x] Custom 404 page (broadcast style)
- [x] Loading/skeleton states for all pages
- [x] Error boundary improvements
- [x] Onboarding flow for new users
- [x] Cookie consent banner
- [x] Share buttons on stories
- [x] Back-to-top button
- [x] Add Privacy & Terms links to footer and register page
- [x] Final responsive design polish
- [x] Run all tests and ensure passing

## Open Graph Preview Images
- [x] Generate main GlobalPulse OG image (1200x630)
- [x] Generate Crime category OG image
- [x] Generate Trending category OG image
- [x] Generate Funny category OG image
- [x] Generate Entertainment category OG image
- [x] Generate Celebrity category OG image
- [x] Generate Gossip category OG image
- [x] Generate Weather category OG image
- [x] Generate Business category OG image
- [x] Integrate OG images into meta tags per route
- [x] Upload all OG images to CDN (permanent URLs)
- [x] Add OGMeta component to all 14 pages
- [x] Update index.html with default OG + Twitter Card meta tags

## Sports Category (9th Category)
- [x] Add Sports to CATEGORIES array in mockData
- [x] Add Sports mock stories (NFL, NBA, Soccer, F1, Tennis, Olympics, etc.)
- [x] Add Sports to ticker bar headlines
- [x] Add Sports rankings data (country/state/city hierarchy)
- [x] Add Sports subcategories (Football, Basketball, Soccer, F1, Tennis, MMA, Olympics)
- [x] Create dedicated SportsPage with subcategory drill-down
- [x] Generate Sports OG image and add to OGMeta
- [x] Update landing page category count from 8 to 9
- [x] Add Sports route to App.tsx
- [x] Update all "8 categories" references to "9 categories"
- [x] Update navigation and category links

## FAQ Page Upgrade
- [ ] Add feedback/suggestion form to FAQ page
- [ ] Form fields: feedback type (bug report, feature request, segment suggestion, general), message, optional email
- [ ] Database table for feedback submissions
- [ ] tRPC endpoint to submit feedback
- [ ] Admin notification on new feedback submission

## Broadcasting Room — Segmented Schedule System
- [ ] Define segment types (Summary, Deep Dive, Sports Hour, Business & Markets, The Roast, Crime Report, Entertainment & Celebrity, The Debate Hour, Comedy Hour, Weather & World, Call-In Hour, etc.)
- [ ] Database schema for broadcast segments and timetable
- [ ] Default global timetable (UTC/GMT) for Marcus & Victoria
- [ ] "Today's Schedule" and "Tomorrow's Schedule" panel in Broadcasters Room
- [ ] Progress bar showing current live segment and what's next
- [ ] "Notify Me" button for favorite segments
- [ ] Admin timetable editor (drag-and-drop segment reordering)
- [ ] Admin can add new segment types and remove/move segments

## Country Broadcasting Rooms (Top 10)
- [ ] Select top 10 countries across all continents (US, UK, Nigeria, India, Canada, Australia, Ghana, South Africa, Brazil, Kenya)
- [ ] Generate culturally diverse broadcaster names (male + female from different ethnic groups per country)
- [ ] Each country room has local timezone-adjusted timetable
- [ ] Each country room has same segment structure as global room
- [ ] Country rooms max 50 call-ins/day, global room max 100 call-ins/day
- [ ] Demo broadcast transcript for each country room (broadcasters speaking in local style)
- [ ] Country room selector UI in Broadcasters Room

## Country Voting System
- [ ] "Vote for Your Country" section on Broadcasters page
- [ ] Dropdown search of all countries
- [ ] Vote button with email capture (or auto-use logged-in account)
- [ ] Vote counter per country visible to users
- [ ] Admin notified when a country hits 1,000 votes
- [ ] Voters notified when their country room goes live
- [ ] Database table for country votes

## Demo Broadcasts for All Rooms
- [ ] Demo transcript for Marcus & Victoria (global room) — already exists, polish it
- [ ] Demo transcripts for each of the 10 country rooms (local language/dialect style)
- [ ] Two broadcasters interacting naturally — questions, laughing, reacting
- [ ] Authentic clean human-like AI voices (no echo, no robotic sound)

## Call-In Experience Polish
- [ ] Phone ring sound effect when caller comes in
- [ ] Background noise cancellation indicator for callers
- [ ] AI anchor can ask caller to reduce noise if detected
- [ ] Smooth caller promotion flow (queue → live)

## Live Subtitles / Translation (Phase 1 — Text)
- [ ] Real-time text captions/CC in listener's selected language
- [ ] User picks language, sees translated subtitles as AI speaks
- [ ] Uses built-in LLM for translation
- [ ] Phase 2 (future): real-time voice translation

## Correspondent Ticker Banner
- [ ] Movie-style banner at top of Broadcasters Room showing live segment, upcoming segments, correspondent info

## User Category Priority / Default Settings
- [ ] Drag-and-rank category order in user profile/settings
- [ ] Personalized summary order based on user priority
- [ ] Personalized ranking display order
- [ ] Personalized trends feed order
- [ ] Save preferences to database per user
