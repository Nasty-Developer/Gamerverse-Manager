import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search as SearchIcon, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "@/components/game-card";
import { 
  useSearchGames,
  useListGenres,
  useListPlatforms,
  getSearchGamesQueryKey,
} from "@workspace/api-client-react";

export default function Search() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeQuery, setActiveQuery] = useState(searchParams.get("q") || "");
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genres") || "");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") || "";
    const genres = new URLSearchParams(window.location.search).get("genres") || "";
    setQuery(q);
    setActiveQuery(q);
    setSelectedGenre(genres);
  }, [window.location.search]);

  const { data: searchResults, isLoading, isFetching } = useSearchGames(
    { q: activeQuery, page_size: 20 },
    { query: { enabled: !!activeQuery, queryKey: getSearchGamesQueryKey({ q: activeQuery, page_size: 20 }) } }
  );

  const { data: genres } = useListGenres();
  const { data: platforms } = useListPlatforms();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setActiveQuery(query);
      setLocation(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 min-h-screen">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-8">
        <div className="bg-card border border-white/10 rounded-xl p-6 sticky top-24">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" /> Filters
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Genres</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {genres?.results?.map(g => (
                  <button 
                    key={g.id}
                    onClick={() => {
                      const newGenre = selectedGenre === g.slug ? "" : g.slug;
                      setSelectedGenre(newGenre);
                      if (newGenre) {
                        setLocation(`/search?q=${encodeURIComponent(query)}&genres=${newGenre}`);
                      }
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedGenre === g.slug ? 'bg-primary text-white font-medium' : 'text-muted-foreground hover:bg-white/5 hover:text-white'}`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Platforms</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {platforms?.results?.map(p => (
                  <button 
                    key={p.id}
                    className="block w-full text-left px-3 py-2 rounded-md text-sm transition-colors text-muted-foreground hover:bg-white/5 hover:text-white"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Results */}
      <main className="flex-1 space-y-6">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <SearchIcon className="absolute left-4 text-muted-foreground w-5 h-5" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for games, publishers, tags..."
            className="w-full pl-12 h-14 bg-card border-white/10 text-lg shadow-lg focus-visible:ring-primary focus-visible:border-primary"
          />
          <Button type="submit" className="absolute right-2 h-10 px-6">
            Search
          </Button>
        </form>

        {activeQuery && (
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Results for "{activeQuery}"</h1>
              {searchResults?.intent && (
                <p className="text-primary font-medium mt-1">Intent detected: {searchResults.intent}</p>
              )}
            </div>
            <div className="text-muted-foreground font-medium">
              {searchResults?.count ? searchResults.count.toLocaleString() : 0} found
            </div>
          </div>
        )}

        {isLoading || isFetching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full rounded-xl bg-white/5" />
            ))}
          </div>
        ) : searchResults?.results?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.results.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : activeQuery ? (
          <div className="text-center py-24 bg-card border border-white/10 rounded-xl">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any games matching "{activeQuery}". Try adjusting your search terms.
            </p>
          </div>
        ) : (
           <div className="text-center py-24 bg-card border border-white/10 rounded-xl">
             <SlidersHorizontal className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
             <h3 className="text-2xl font-bold text-white mb-2">Discover Games</h3>
             <p className="text-muted-foreground max-w-md mx-auto">
               Enter a search term above or use the filters to explore our massive database of games.
             </p>
           </div>
        )}
      </main>
    </div>
  );
}
