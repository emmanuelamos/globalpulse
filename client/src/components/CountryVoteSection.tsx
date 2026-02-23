/*
 * CountryVoteSection — "Vote for Your Country" component
 * Users can vote for their country to get a dedicated broadcasting room
 * Shows vote counts and allows email capture for notifications
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Vote, Search, CheckCircle2, Bell, ChevronDown, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { COUNTRY_BROADCASTERS } from "@/lib/broadcastData";

// Full list of countries for voting (beyond the active 10)
const ALL_COUNTRIES = [
  { code: "AF", name: "Afghanistan" }, { code: "AL", name: "Albania" }, { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" }, { code: "AT", name: "Austria" }, { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" }, { code: "BO", name: "Bolivia" }, { code: "BW", name: "Botswana" },
  { code: "CL", name: "Chile" }, { code: "CN", name: "China" }, { code: "CO", name: "Colombia" },
  { code: "CR", name: "Costa Rica" }, { code: "HR", name: "Croatia" }, { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" }, { code: "DO", name: "Dominican Republic" }, { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" }, { code: "SV", name: "El Salvador" }, { code: "ET", name: "Ethiopia" },
  { code: "FI", name: "Finland" }, { code: "FR", name: "France" }, { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" }, { code: "GT", name: "Guatemala" }, { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" }, { code: "HU", name: "Hungary" }, { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" }, { code: "IQ", name: "Iraq" }, { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" }, { code: "IT", name: "Italy" }, { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" }, { code: "JO", name: "Jordan" }, { code: "KZ", name: "Kazakhstan" },
  { code: "KW", name: "Kuwait" }, { code: "LB", name: "Lebanon" }, { code: "LY", name: "Libya" },
  { code: "MY", name: "Malaysia" }, { code: "MX", name: "Mexico" }, { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" }, { code: "MM", name: "Myanmar" }, { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" }, { code: "NZ", name: "New Zealand" }, { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" }, { code: "NO", name: "Norway" }, { code: "PK", name: "Pakistan" },
  { code: "PA", name: "Panama" }, { code: "PY", name: "Paraguay" }, { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" }, { code: "PL", name: "Poland" }, { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" }, { code: "RO", name: "Romania" }, { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" }, { code: "SN", name: "Senegal" }, { code: "RS", name: "Serbia" },
  { code: "SG", name: "Singapore" }, { code: "SK", name: "Slovakia" }, { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" }, { code: "SD", name: "Sudan" }, { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" }, { code: "TW", name: "Taiwan" }, { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" }, { code: "TT", name: "Trinidad and Tobago" }, { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" }, { code: "UG", name: "Uganda" }, { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" }, { code: "UY", name: "Uruguay" }, { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" }, { code: "ZM", name: "Zambia" }, { code: "ZW", name: "Zimbabwe" },
].filter((c) => !COUNTRY_BROADCASTERS.some((cb) => cb.countryCode === c.code));

export default function CountryVoteSection() {
  const { user } = useAuth();
  const voteMutation = trpc.countryVotes.vote.useMutation();
  const { data: voteCounts } = trpc.countryVotes.counts.useQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string } | null>(null);
  const [email, setEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [voted, setVoted] = useState(false);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return ALL_COUNTRIES.slice(0, 10);
    return ALL_COUNTRIES.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10);
  }, [searchQuery]);

  const topVoted = useMemo(() => {
    if (!voteCounts) return [];
    return [...voteCounts].sort((a, b) => Number(b.voteCount) - Number(a.voteCount)).slice(0, 5);
  }, [voteCounts]);

  const handleVote = async () => {
    if (!selectedCountry) return;
    try {
      await voteMutation.mutateAsync({
        countryCode: selectedCountry.code,
        countryName: selectedCountry.name,
        email: !user ? email || undefined : undefined,
        notifyWhenLive: true,
      });
      setVoted(true);
      setTimeout(() => {
        setVoted(false);
        setSelectedCountry(null);
        setEmail("");
      }, 5000);
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  return (
    <div className="glass-card rounded-2xl border border-neon-amber/20 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/10 bg-gradient-to-r from-neon-amber/5 to-neon-magenta/5">
        <div className="flex items-center gap-3 mb-2">
          <Vote className="w-6 h-6 text-neon-amber" />
          <h3 className="text-xl font-display font-bold">Vote for Your Country</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Don't see your country's broadcast room? Vote to add it! Once a country reaches <span className="text-neon-amber font-bold">1,000 votes</span>, we'll create a dedicated room with local AI broadcasters.
        </p>
      </div>

      {voted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 text-center"
        >
          <CheckCircle2 className="w-12 h-12 text-neon-green mx-auto mb-4" />
          <h4 className="text-lg font-display font-bold mb-2">Vote Recorded!</h4>
          <p className="text-sm text-muted-foreground">
            We'll notify you when {selectedCountry?.name}'s broadcast room goes live.
          </p>
        </motion.div>
      ) : (
        <div className="p-6 space-y-6">
          {/* Country search */}
          <div className="relative">
            <label className="block text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Search Your Country
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={selectedCountry ? selectedCountry.name : searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedCountry(null);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Type your country name..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/30 border border-border/20 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-amber/40 focus:ring-1 focus:ring-neon-amber/20"
              />
              {selectedCountry && (
                <button
                  onClick={() => { setSelectedCountry(null); setSearchQuery(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {showDropdown && !selectedCountry && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute z-50 w-full mt-1 bg-background border border-border/30 rounded-xl shadow-2xl max-h-48 overflow-y-auto"
                >
                  {filteredCountries.length === 0 ? (
                    <div className="p-3 text-sm text-muted-foreground text-center">No countries found</div>
                  ) : (
                    filteredCountries.map((country) => {
                      const voteCount = voteCounts?.find((v) => v.countryCode === country.code);
                      return (
                        <button
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country);
                            setSearchQuery("");
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-neon-amber/10 transition-colors"
                        >
                          <span>{country.name}</span>
                          {voteCount && (
                            <span className="text-xs text-neon-amber font-mono">{Number(voteCount.voteCount).toLocaleString()} votes</span>
                          )}
                        </button>
                      );
                    })
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Email (non-logged-in users) */}
          {!user && (
            <div>
              <label className="block text-xs font-display font-bold text-muted-foreground uppercase tracking-wider mb-2">
                <Bell className="w-3 h-3 inline mr-1" />
                Email <span className="text-muted-foreground/50">(to notify you when your room goes live)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/20 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-amber/40 focus:ring-1 focus:ring-neon-amber/20"
              />
            </div>
          )}

          {/* Vote button */}
          <button
            onClick={handleVote}
            disabled={!selectedCountry || voteMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-amber to-neon-magenta text-white font-display font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_30px_oklch(0.85_0.18_85/0.3)] transition-all"
          >
            <Globe className="w-4 h-4" />
            {voteMutation.isPending ? "Submitting..." : "Vote for This Country"}
          </button>

          {/* Top voted countries */}
          {topVoted.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-neon-amber" />
                <span className="text-xs font-display font-bold text-muted-foreground uppercase tracking-wider">
                  Most Requested Countries
                </span>
              </div>
              <div className="space-y-2">
                {topVoted.map((v, i) => (
                  <div
                    key={v.countryCode}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-secondary/20 border border-border/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neon-amber font-bold">#{i + 1}</span>
                      <span className="text-sm">{v.countryName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-neon-amber to-neon-magenta"
                          style={{ width: `${Math.min((Number(v.voteCount) / 1000) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {Number(v.voteCount).toLocaleString()}/1,000
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
