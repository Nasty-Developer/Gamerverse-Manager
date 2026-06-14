import { useState } from "react";
import { useLocation } from "wouter";
import { Compass, Filter, ArrowUpDown } from "lucide-react";
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
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState("-relevance");
  const [genre, setGenre] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");

  const { data: games, isLoading } = useListGames({ 
    page, 
    page_size: 24, 
    ordering,
    ...(genre && genre !== "all" ? { genres: genre } : {}),
    ...(platform && platform !== "all" ? { platforms: platform } : {})
  });

  const { data: genres } = useListGenres();
  const { data: platforms } = useListPlatforms();

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-white flex items-center gap-3 mb-2">
            <Compass className="w-10 h-10 text-primary" />
            Discover Games
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Browse our complete database. Use filters to narrow down the massive collection and find exactly what you want to play next.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-card p-3 rounded-lg border border-white/10 shadow-xl">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="w-[140px] bg-background border-white/10">
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
          
          <div className="flex items-center gap-2">
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-[160px] bg-background border-white/10">
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

          <div className="h-8 w-px bg-white/10 hidden sm:block mx-2" />

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <Select value={ordering} onValueChange={setOrdering}>
              <SelectTrigger className="w-[160px] bg-background border-white/10">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-relevance">Relevance</SelectItem>
                <SelectItem value="-added">Popularity</SelectItem>
                <SelectItem value="-released">Release Date (Newest)</SelectItem>
                <SelectItem value="-rating">Rating</SelectItem>
                <SelectItem value="-metacritic">Metacritic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading && page === 1 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {Array.from({ length: 24 }).map((_, i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-xl bg-white/5" />
          ))}
        </div>
      ) : games?.results?.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-12">
            {games.results.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
          
          <div className="flex justify-center items-center gap-4 py-8 border-t border-white/10">
            <Button 
              variant="outline" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-32 border-white/10 hover:bg-white/5"
            >
              Previous
            </Button>
            <span className="text-muted-foreground font-medium">Page {page}</span>
            <Button 
              variant="outline" 
              onClick={() => setPage(p => p + 1)}
              disabled={!games.next}
              className="w-32 border-white/10 hover:bg-white/5"
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-32 bg-card border border-white/10 rounded-xl">
          <h3 className="text-2xl font-bold text-white mb-2">No games found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
