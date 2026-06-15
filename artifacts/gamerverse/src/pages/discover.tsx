import { useState } from "react";
import { useLocation } from "wouter";
import { Compass, Filter, ArrowUpDown, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "@/components/game-card";
import {
  useListGames,
  useListGenres,
  useListPlatforms
} from "@workspace/api-client-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Discover() {
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState("-relevance");
  const [genre, setGenre] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: games, isLoading } = useListGames({
    page,
    page_size: 24,
    ordering,
    ...(genre && genre !== "all" ? { genres: genre } : {}),
    ...(platform && platform !== "all" ? { platforms: platform } : {})
  });

  const { data: genres } = useListGenres();
  const { data: platforms } = useListPlatforms();

  const activeFilters = [
    genre && genre !== "all" ? genres?.results?.find(g => g.slug === genre)?.name : null,
    platform && platform !== "all" ? platforms?.results?.find(p => p.id.toString() === platform)?.name : null,
  ].filter(Boolean);

  const clearFilters = () => { setGenre(""); setPlatform(""); setPage(1); };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-2">
          <Compass className="w-9 h-9 text-primary flex-shrink-0" />
          Discover Games
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Browse our full database. Filter by genre, platform, and sort to find exactly what you want to play.
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-8">
        {/* Desktop filters */}
        <div className="hidden sm:flex flex-wrap items-center gap-3 bg-card p-3 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>

          <Select value={genre} onValueChange={v => { setGenre(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] bg-background border-white/10 h-9 text-sm">
              <SelectValue placeholder="All Genres" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres?.results?.map(g => (
                <SelectItem key={g.id} value={g.slug}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={platform} onValueChange={v => { setPlatform(v); setPage(1); }}>
            <SelectTrigger className="w-[160px] bg-background border-white/10 h-9 text-sm">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms?.results?.map(p => (
                <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-6 w-px bg-white/10 mx-1" />

          <div className="flex items-center gap-2 text-muted-foreground">
            <ArrowUpDown className="w-4 h-4" />
          </div>
          <Select value={ordering} onValueChange={v => { setOrdering(v); setPage(1); }}>
            <SelectTrigger className="w-[180px] bg-background border-white/10 h-9 text-sm">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-relevance">Relevance</SelectItem>
              <SelectItem value="-added">Popularity</SelectItem>
              <SelectItem value="-released">Newest First</SelectItem>
              <SelectItem value="-rating">Highest Rated</SelectItem>
              <SelectItem value="-metacritic">Best Metacritic</SelectItem>
            </SelectContent>
          </Select>

          {activeFilters.length > 0 && (
            <>
              <div className="h-6 w-px bg-white/10 mx-1" />
              <div className="flex items-center gap-2">
                {activeFilters.map(f => (
                  <span key={f} className="text-xs bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 rounded-full font-medium">{f}</span>
                ))}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-white h-7 px-2 text-xs">
                  <X className="w-3 h-3 mr-1" />Clear
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile filters */}
        <div className="sm:hidden space-y-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(f => !f)}
              className="flex-1 border-white/10 bg-card h-11 text-sm font-medium flex items-center justify-between px-4"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full font-bold">{activeFilters.length}</span>
                )}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>

            <Select value={ordering} onValueChange={v => { setOrdering(v); setPage(1); }}>
              <SelectTrigger className="flex-1 bg-card border-white/10 h-11 text-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-relevance">Relevance</SelectItem>
                <SelectItem value="-added">Popularity</SelectItem>
                <SelectItem value="-released">Newest First</SelectItem>
                <SelectItem value="-rating">Highest Rated</SelectItem>
                <SelectItem value="-metacritic">Best Metacritic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showFilters && (
            <div className="bg-card border border-white/10 rounded-xl p-4 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Genre</p>
                <Select value={genre} onValueChange={v => { setGenre(v); setPage(1); }}>
                  <SelectTrigger className="bg-background border-white/10 h-10 text-sm w-full">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres?.results?.map(g => (
                      <SelectItem key={g.id} value={g.slug}>{g.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Platform</p>
                <Select value={platform} onValueChange={v => { setPlatform(v); setPage(1); }}>
                  <SelectTrigger className="bg-background border-white/10 h-10 text-sm w-full">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    {platforms?.results?.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-muted-foreground hover:text-white text-xs">
                  <X className="w-3 h-3 mr-1" /> Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game grid */}
      {isLoading && page === 1 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <Skeleton key={i} className="h-[260px] w-full rounded-xl bg-white/5" />
          ))}
        </div>
      ) : games?.results?.length ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-10">
            {games.results.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 py-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-28 border-white/10 hover:bg-white/5 hover:border-white/20 disabled:opacity-30"
            >
              Previous
            </Button>
            <span className="text-muted-foreground font-medium text-sm min-w-[80px] text-center">Page {page}</span>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={!games.next}
              className="w-28 border-white/10 hover:bg-white/5 hover:border-white/20 disabled:opacity-30"
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-28 bg-card border border-white/10 rounded-xl">
          <Compass className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-2xl font-bold text-white mb-2">No games found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your filters or clearing them entirely.</p>
          {activeFilters.length > 0 && (
            <Button variant="outline" onClick={clearFilters} className="border-white/10 hover:bg-white/5">
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
