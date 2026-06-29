import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Search as SearchIcon,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
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
  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get("genres") || "",
  );
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") || "";
    const genres =
      new URLSearchParams(window.location.search).get("genres") || "";
    setQuery(q);
    setActiveQuery(q);
    setSelectedGenre(genres);
  }, [window.location.search]);

  const {
    data: searchResults,
    isLoading,
    isFetching,
  } = useSearchGames(
    {
      q: activeQuery,
      genres: selectedGenre,
      page_size: 20,
    },
    {
      query: {
        enabled: !!activeQuery || !!selectedGenre,
        queryKey: getSearchGamesQueryKey({
          q: activeQuery,
          genres: selectedGenre,
          page_size: 20,
        }),
      },
    },
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

  const selectGenre = (slug: string) => {
    const next = selectedGenre === slug ? "" : slug;

    setSelectedGenre(next);

    if (next) {
      setQuery("");
      setActiveQuery("");

      setLocation(`/search?genres=${next}`);
    } else {
      setLocation("/search");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative flex items-center mb-6">
        <SearchIcon className="absolute left-4 text-muted-foreground w-5 h-5 pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for games, publishers, tags..."
          className="w-full pl-12 pr-32 h-14 bg-card border-white/10 text-lg shadow-lg focus-visible:ring-primary focus-visible:border-primary"
        />
        <Button
          type="submit"
          className="absolute right-2 h-10 px-6 font-semibold"
        >
          Search
        </Button>
      </form>

      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setFiltersOpen((f) => !f)}
          className="w-full border-white/10 bg-card flex items-center justify-between px-4 h-11"
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4 text-primary" />
            Filters
            {selectedGenre && (
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-bold">
                1
              </span>
            )}
          </span>
          {filtersOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>

        {filtersOpen && (
          <div className="mt-2 bg-card border border-white/10 rounded-xl p-4 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {genres?.results?.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => selectGenre(g.slug)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      selectedGenre === g.slug
                        ? "bg-primary border-primary text-white"
                        : "bg-white/5 border-white/10 text-muted-foreground hover:text-white hover:border-white/20"
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
            {selectedGenre && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedGenre("");
                  setLocation("/search");
                }}
                className="text-muted-foreground hover:text-white w-full"
              >
                <X className="w-3.5 h-3.5 mr-1.5" /> Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-56 shrink-0 space-y-8">
          <div className="bg-card border border-white/10 rounded-xl p-5 sticky top-24">
            <h2 className="text-sm font-bold text-white mb-5 flex items-center gap-2 uppercase tracking-wider">
              <Filter className="w-4 h-4 text-primary" /> Filters
            </h2>

            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                  Genres
                </h3>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {genres?.results?.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => selectGenre(g.slug)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedGenre === g.slug
                          ? "bg-primary/20 text-primary font-semibold border border-primary/30"
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                  Platforms
                </h3>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {platforms?.results?.map((p) => (
                    <button
                      key={p.id}
                      className="block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors text-muted-foreground hover:bg-white/5 hover:text-white"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedGenre && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedGenre("");
                    setLocation(`/search?q=${encodeURIComponent(query)}`);
                  }}
                  className="w-full text-muted-foreground hover:text-white text-xs"
                >
                  <X className="w-3 h-3 mr-1.5" /> Clear filters
                </Button>
              )}
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="flex-1 min-w-0 space-y-5">
          {(activeQuery || selectedGenre) && (
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4">
              <div>
                <h1 className="text-xl font-bold text-white">
                  Results for "{activeQuery || selectedGenre}"
                </h1>
                {searchResults?.intent && !isLoading && !isFetching && (
                  <p className="text-primary font-medium mt-0.5 text-sm">
                    Intent: {searchResults.intent}
                  </p>
                )}
              </div>
              <div className="text-muted-foreground font-medium text-sm shrink-0 ml-3">
                {isLoading || isFetching ? (
                  <span className="text-muted-foreground/60">Searching…</span>
                ) : (
                  <span>
                    {searchResults?.count
                      ? searchResults.count.toLocaleString()
                      : 0}{" "}
                    found
                  </span>
                )}
              </div>
            </div>
          )}

          {isLoading || isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[280px] w-full rounded-xl bg-white/5"
                />
              ))}
            </div>
          ) : searchResults?.results?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.results.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : activeQuery ? (
            <div className="text-center py-20 bg-card border border-white/10 rounded-xl">
              <SearchIcon className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-2xl font-bold text-white mb-2">
                No results found
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                Nothing matched "{activeQuery}". Try different keywords or
                browse by genre.
              </p>
              <Button
                variant="outline"
                className="mt-6 border-white/10 hover:bg-white/5"
                onClick={() => {
                  setQuery("");
                  setActiveQuery("");
                  setLocation("/search");
                }}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="text-center py-20 bg-card border border-white/10 rounded-xl">
              <SlidersHorizontal className="w-14 h-14 text-muted-foreground mx-auto mb-4 opacity-40" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Discover Games
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                Enter a search term above to explore our database of thousands
                of games.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
                {[
                  "RPG",
                  "Action",
                  "Indie",
                  "Strategy",
                  "Horror",
                  "Open World",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      setActiveQuery(term);
                      setLocation(`/search?q=${encodeURIComponent(term)}`);
                    }}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
