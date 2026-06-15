import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Plus, X, Search, Star, ExternalLink, Monitor, Building, Users, ShieldAlert, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  useGetGame,
  useListGames,
  getGetGameQueryKey,
  getListGamesQueryKey,
} from "@workspace/api-client-react";

const MAX_GAMES = 4;

function useGameSlots(s0: string, s1: string, s2: string, s3: string) {
  const g0 = useGetGame(s0, { query: { enabled: !!s0, queryKey: getGetGameQueryKey(s0) } });
  const g1 = useGetGame(s1, { query: { enabled: !!s1, queryKey: getGetGameQueryKey(s1) } });
  const g2 = useGetGame(s2, { query: { enabled: !!s2, queryKey: getGetGameQueryKey(s2) } });
  const g3 = useGetGame(s3, { query: { enabled: !!s3, queryKey: getGetGameQueryKey(s3) } });
  return [g0, g1, g2, g3] as const;
}

function GameSearchInput({ onSelect, excluded }: { onSelect: (slug: string) => void; excluded: string[] }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const listParams = { search: debounced, page_size: 8, ordering: "-rating" };
  const { data, isLoading } = useListGames(
    listParams,
    { query: { enabled: debounced.length >= 2, queryKey: getListGamesQueryKey(listParams) } }
  );

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search for a game..."
          className="pl-9 bg-background/80 border-white/10 text-white placeholder:text-muted-foreground focus-visible:ring-primary"
        />
      </div>
      {open && debounced.length >= 2 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-card border border-white/20 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full bg-white/5 rounded-lg" />)}
            </div>
          ) : data?.results?.length ? (
            data.results.map(game => {
              const added = excluded.includes(game.slug);
              return (
                <button
                  key={game.id}
                  onClick={() => { if (!added) { onSelect(game.slug); setQuery(""); setOpen(false); } }}
                  disabled={added}
                  className={`flex items-center gap-3 w-full p-2.5 text-left transition-colors border-b border-white/5 last:border-0 ${added ? "opacity-40 cursor-not-allowed" : "hover:bg-white/5 cursor-pointer"}`}
                >
                  {game.background_image ? (
                    <img src={game.background_image} alt="" className="w-14 h-8 object-cover rounded flex-shrink-0" />
                  ) : (
                    <div className="w-14 h-8 bg-white/5 rounded flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{game.name}</p>
                    <p className="text-muted-foreground text-xs">{game.released ? new Date(game.released).getFullYear() : "Unknown"}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {game.rating > 0 && (
                      <span className="flex items-center gap-1 text-yellow-400 text-xs">
                        <Star className="w-3 h-3 fill-current" />{game.rating.toFixed(1)}
                      </span>
                    )}
                    {added && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-muted-foreground">Added</span>}
                  </div>
                </button>
              );
            })
          ) : (
            <p className="p-4 text-muted-foreground text-sm text-center">No games found for "{debounced}"</p>
          )}
        </div>
      )}
    </div>
  );
}

function RatingBar({ value, isBest }: { value: number; isBest: boolean }) {
  const pct = Math.min(100, (value / 5) * 100);
  const barColor = isBest ? "bg-green-400" : pct >= 70 ? "bg-yellow-400" : "bg-orange-500";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className={`text-2xl font-black ${isBest ? "text-green-400" : "text-white"}`}>
        {value > 0 ? value.toFixed(1) : "N/A"}
      </span>
      {value > 0 && (
        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}

function MetaBadge({ value, isBest }: { value: number | null | undefined; isBest: boolean }) {
  if (!value) return <span className="text-muted-foreground text-sm">N/A</span>;
  const color = value >= 80 ? "border-green-500 text-green-400" : value >= 60 ? "border-yellow-500 text-yellow-400" : "border-red-500 text-red-400";
  return (
    <span className={`font-black text-2xl border-2 px-2 py-0.5 rounded inline-block ${color} ${isBest ? "ring-2 ring-offset-1 ring-offset-card ring-green-400/40" : ""}`}>
      {value}
    </span>
  );
}

interface RowProps {
  label: React.ReactNode;
  cells: React.ReactNode[];
}
function Row({ label, cells }: RowProps) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.015] transition-colors">
      <td className="py-4 px-5 align-middle sticky left-0 bg-card w-36 md:w-44 z-10">
        <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">{label}</span>
      </td>
      {cells.map((cell, i) => (
        <td key={i} className="py-4 px-4 text-center align-middle text-sm text-white">{cell ?? <span className="text-muted-foreground">—</span>}</td>
      ))}
    </tr>
  );
}

export default function Compare() {
  const [slugs, setSlugs] = useState<string[]>([]);

  const add = (slug: string) => { if (slugs.length < MAX_GAMES && !slugs.includes(slug)) setSlugs(p => [...p, slug]); };
  const remove = (slug: string) => setSlugs(p => p.filter(s => s !== slug));

  const [s0, s1, s2, s3] = ([...slugs, "", "", "", ""].slice(0, 4)) as [string, string, string, string];
  const [r0, r1, r2, r3] = useGameSlots(s0, s1, s2, s3);
  const allResults = [r0, r1, r2, r3] as const;

  const gameData = slugs.map((_, i) => allResults[i].data ?? null);
  const bestRating = Math.max(...gameData.map(g => g?.rating ?? 0));
  const bestMeta = Math.max(...gameData.map(g => g?.metacritic ?? 0));
  const hasComparison = slugs.length >= 2;
  const n = slugs.length;

  const slotGridClass =
    n === 0 ? "grid-cols-1 max-w-sm mx-auto" :
    n === 1 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto" :
    n === 2 ? "grid-cols-1 sm:grid-cols-3" :
    n === 3 ? "grid-cols-2 lg:grid-cols-4" :
    "grid-cols-2 lg:grid-cols-4";

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 mb-4 text-sm font-semibold uppercase tracking-wide">
            <Scale className="w-4 h-4" /> Compare Games
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Head-to-Head <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Comparison</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Compare up to {MAX_GAMES} games — ratings, metacritic, platforms, developers, and more.
          </p>
        </div>

        {/* Game slots */}
        <div className={`grid gap-4 mb-8 ${slotGridClass}`}>
          {slugs.map((slug, i) => {
            const { data: game, isLoading } = allResults[i];
            return (
              <motion.div
                key={slug}
                layout
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card border border-white/10 rounded-2xl overflow-hidden relative group"
              >
                <button
                  onClick={() => remove(slug)}
                  aria-label="Remove game"
                  className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-red-500/50 hover:border-red-400/60 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                {isLoading ? (
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-28 w-full bg-white/5 rounded-lg" />
                    <Skeleton className="h-4 w-3/4 bg-white/5" />
                    <Skeleton className="h-3 w-1/2 bg-white/5" />
                  </div>
                ) : game ? (
                  <>
                    <Link href={`/games/${game.slug}`}>
                      <div className="relative h-28 overflow-hidden bg-muted">
                        {game.background_image ? (
                          <img src={game.background_image} alt={game.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-card to-background flex items-center justify-center">
                            <Monitor className="w-8 h-8 text-muted-foreground opacity-30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      </div>
                    </Link>
                    <div className="p-3">
                      <Link href={`/games/${game.slug}`} className="hover:text-primary transition-colors">
                        <h3 className="font-bold text-white text-sm line-clamp-2 mb-1 leading-tight">{game.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                        <span className="text-yellow-400 font-medium">{game.rating.toFixed(1)}</span>
                        {game.released && <><span>·</span><span>{new Date(game.released).getFullYear()}</span></>}
                        {game.metacritic && <><span>·</span><span className="text-green-400 font-bold">MC:{game.metacritic}</span></>}
                      </div>
                    </div>
                    <button
                      onClick={() => remove(slug)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-red-500/50 hover:border-red-400/60 transition-all sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </>
                ) : null}
              </motion.div>
            );
          })}

          {/* Add slot */}
          {slugs.length < MAX_GAMES && (
            <motion.div layout className="bg-white/[0.02] border border-dashed border-white/20 rounded-2xl p-4 flex flex-col gap-3 justify-center min-h-[160px]">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {slugs.length === 0 ? "Search to add a game" : `Add game ${slugs.length + 1} of ${MAX_GAMES}`}
                </span>
              </div>
              <GameSearchInput onSelect={add} excluded={slugs} />
            </motion.div>
          )}
        </div>

        {/* Empty state hint */}
        {!hasComparison && (
          <div className="text-center py-12 bg-white/[0.015] border border-dashed border-white/10 rounded-2xl">
            <Scale className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground text-sm">Add at least 2 games above to see the side-by-side comparison</p>
          </div>
        )}

        {/* Comparison table */}
        <AnimatePresence>
          {hasComparison && (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-0"
            >
              <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ minWidth: `${180 + n * 180}px` }}>
                    <thead>
                      <tr className="border-b border-white/10 bg-background/60">
                        <th className="py-4 px-5 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground sticky left-0 bg-background/60 w-36 md:w-44 z-10">
                          Category
                        </th>
                        {slugs.map((_, i) => {
                          const g = gameData[i];
                          return (
                            <th key={i} className="py-4 px-4 text-center">
                              {g ? (
                                <Link href={`/games/${g.slug}`} className="inline-flex items-center justify-center gap-1.5 group/link">
                                  <span className="text-white font-bold text-sm group-hover/link:text-primary transition-colors line-clamp-1">
                                    {g.name.length > 20 ? g.name.slice(0, 20) + "…" : g.name}
                                  </span>
                                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover/link:text-primary transition-colors flex-shrink-0" />
                                </Link>
                              ) : (
                                <Skeleton className="h-4 w-28 mx-auto bg-white/5" />
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      <Row
                        label={<span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />Rating</span>}
                        cells={gameData.map((g, i) => g ? <RatingBar value={g.rating} isBest={(g.rating ?? 0) === bestRating && bestRating > 0} /> : null)}
                      />
                      <Row
                        label="Metacritic"
                        cells={gameData.map((g, i) => <MetaBadge value={g?.metacritic} isBest={!!g?.metacritic && g.metacritic === bestMeta} />)}
                      />
                      <Row
                        label={<span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Released</span>}
                        cells={gameData.map(g => g?.released ? new Date(g.released).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : null)}
                      />
                      <Row
                        label={<span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" />ESRB</span>}
                        cells={gameData.map(g => g?.esrb_rating?.name ?? null)}
                      />
                      <Row
                        label="Genres"
                        cells={gameData.map(g => g ? (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {g.genres.slice(0, 4).map(gen => (
                              <span key={gen.id} className="text-[10px] px-2 py-0.5 bg-primary/15 text-primary/90 border border-primary/30 rounded-full">{gen.name}</span>
                            ))}
                          </div>
                        ) : null)}
                      />
                      <Row
                        label={<span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" />Platforms</span>}
                        cells={gameData.map(g => g ? (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {g.platforms.slice(0, 4).map(p => (
                              <span key={p.platform.id} className="text-[10px] px-1.5 py-0.5 bg-white/5 text-muted-foreground border border-white/10 rounded">{p.platform.name}</span>
                            ))}
                            {g.platforms.length > 4 && <span className="text-[10px] text-muted-foreground">+{g.platforms.length - 4}</span>}
                          </div>
                        ) : null)}
                      />
                      <Row
                        label={<span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />Developer</span>}
                        cells={gameData.map(g => g?.developers?.length ? g.developers.map(d => d.name).join(", ") : null)}
                      />
                      <Row
                        label={<span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />Publisher</span>}
                        cells={gameData.map(g => g?.publishers?.length ? g.publishers.map(p => p.name).join(", ") : null)}
                      />
                      <Row
                        label="Avg Playtime"
                        cells={gameData.map(g => g?.playtime ? `~${g.playtime}h` : null)}
                      />
                      <Row
                        label="Total Reviews"
                        cells={gameData.map(g => g?.ratings_count ? g.ratings_count.toLocaleString() : null)}
                      />
                    </tbody>
                  </table>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
