import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, ArrowRight, Gamepad2, Flame, Calendar, Star, LayoutGrid, Cpu, Bookmark, Wrench, Scale, Gamepad } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "@/components/game-card";
import { 
  useGetTrendingGames, 
  useGetNewReleases, 
  useGetTopRatedGames, 
  useListGenres,
  useListFeatured,
  useListNews
} from "@workspace/api-client-react";

function SectionSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[200px] w-full rounded-xl bg-white/5" />
          <Skeleton className="h-4 w-3/4 bg-white/5" />
          <Skeleton className="h-4 w-1/2 bg-white/5" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholders = ["Best action games...", "Games like GTA V...", "Cyberpunk RPGs...", "Games for low-end PC..."];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const { data: trending, isLoading: loadingTrending } = useGetTrendingGames({ page_size: 5 });
  const { data: newReleases, isLoading: loadingNew } = useGetNewReleases({ page_size: 10 });
  const { data: topRated, isLoading: loadingTop } = useGetTopRatedGames({ page_size: 10 });
  const { data: genres } = useListGenres();
  const { data: featuredCollections } = useListFeatured();
  const { data: news } = useListNews({ page_size: 3 });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 mb-6 text-sm font-semibold tracking-wide uppercase">
              <Gamepad2 className="w-4 h-4" />
              <span>The Ultimate Discovery Engine</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 drop-shadow-2xl">
              Find Your Next <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Obsession</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Explore thousands of games, compare requirements, and read reviews in the most immersive gaming database.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-3xl"
          >
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full transition-opacity opacity-0 group-hover:opacity-100" />
              <div className="relative flex items-center bg-card/80 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-2xl transition-all hover:border-primary/50 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/20">
                <SearchIcon className="w-6 h-6 text-muted-foreground ml-4" />
                <div className="relative flex-1 h-14">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="absolute inset-0 h-full w-full bg-transparent border-0 focus-visible:ring-0 text-xl text-white placeholder:text-transparent px-4"
                    data-testid="input-hero-search"
                  />
                  {!searchQuery && (
                    <div className="absolute inset-0 flex items-center px-4 pointer-events-none overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={placeholderIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-xl text-muted-foreground/70 truncate"
                        >
                          {placeholders[placeholderIndex]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  )}
                </div>
                <Button type="submit" size="lg" className="rounded-full h-12 px-8 text-lg font-bold" data-testid="button-hero-search">
                  Search
                </Button>
              </div>
            </form>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-muted-foreground mr-2 self-center">Popular:</span>
              {["RPG", "Open World", "Multiplayer", "Cyberpunk 2077"].map((term) => (
                <button
                  key={term}
                  onClick={() => setLocation(`/search?q=${encodeURIComponent(term)}`)}
                  className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">Everything You Need to Find Your Game</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">GamerVerse brings together discovery, compatibility, and community in one place.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: SearchIcon, color: "text-primary bg-primary/20 border-primary/30", title: "Game Discovery", desc: "Natural language search — 'best open world RPGs', 'games like GTA V', 'best horror games'.", href: "/search", cta: "Search Games" },
            { icon: Scale, color: "text-accent bg-accent/20 border-accent/30", title: "Compare Games", desc: "Compare ratings, metacritic scores, genres, platforms, and requirements side by side.", href: "/compare", cta: "Compare Now" },
            { icon: Cpu, color: "text-green-400 bg-green-500/20 border-green-500/30", title: "System Requirements", desc: "Enter your CPU, GPU, and RAM to see if you can run any game before downloading.", href: "/pc-check", cta: "Check My PC" },
            { icon: Bookmark, color: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30", title: "Wishlist", desc: "Save games you want to play and build your personal gaming backlog.", href: "/wishlist", cta: "View Wishlist" },
            { icon: Gamepad, color: "text-orange-400 bg-orange-500/20 border-orange-500/30", title: "Request a Game", desc: "Can't find a game? Submit a request and we'll add it to the platform.", href: "/request-game", cta: "Submit Request" },
            { icon: Wrench, color: "text-pink-400 bg-pink-500/20 border-pink-500/30", title: "Request Mod Links", desc: "Request mods for your favorite games. Vote on requests and track their status.", href: "/request-mod", cta: "Request a Mod" },
          ].map(({ icon: Icon, color, title, desc, href, cta }) => (
            <motion.button
              key={title}
              whileHover={{ scale: 1.02, y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => setLocation(href)}
              className="group bg-card border border-white/10 rounded-2xl p-6 text-left hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all flex flex-col"
            >
              <div className={`inline-flex p-3 rounded-xl border mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">{desc}</p>
              <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between">
                <span className="text-primary text-sm font-semibold">{cta}</span>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12 space-y-24">
        
        {/* Trending Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
              <Flame className="w-8 h-8 text-orange-500" />
              Trending Now
            </h2>
            <Button variant="ghost" onClick={() => setLocation("/discover?ordering=-added")}>
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {loadingTrending ? <SectionSkeleton /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {trending?.results?.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>

        {/* New Releases */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
              <Calendar className="w-8 h-8 text-primary" />
              New Releases
            </h2>
            <Button variant="ghost" onClick={() => setLocation("/discover?ordering=-released")}>
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {loadingNew ? <SectionSkeleton /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {newReleases?.results?.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Collections */}
        {featuredCollections && featuredCollections.length > 0 && (
          <section className="space-y-16">
            {featuredCollections.map((collection) => (
              <div key={collection.id} className="relative rounded-3xl overflow-hidden border border-white/10 bg-card/50">
                <div className="absolute inset-0">
                  <img src={collection.imageUrl} alt={collection.title} className="w-full h-full object-cover opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
                </div>
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-1/3">
                    <h3 className="text-3xl font-bold text-white mb-4">{collection.title}</h3>
                    <p className="text-muted-foreground mb-6 text-lg">{collection.description}</p>
                    <Button onClick={() => setLocation(`/search?q=${encodeURIComponent(collection.title)}`)}>
                      Explore Collection <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collection.games.slice(0, 3).map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Top Rated */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              Highest Rated All Time
            </h2>
            <Button variant="ghost" onClick={() => setLocation("/discover?ordering=-rating")}>
              View All <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {loadingTop ? <SectionSkeleton /> : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {topRated?.results?.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </section>

        {/* Popular Genres */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-white">
              <LayoutGrid className="w-8 h-8 text-accent" />
              Browse by Genre
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {genres?.results?.slice(0, 12).map((genre) => (
              <button
                key={genre.id}
                onClick={() => setLocation(`/search?genres=${genre.slug}`)}
                className="group relative h-32 rounded-xl overflow-hidden border border-white/10 text-left"
              >
                {genre.image_background && (
                  <img src={genre.image_background} alt={genre.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-40 group-hover:opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{genre.name}</h3>
                  <p className="text-xs text-muted-foreground">{genre.games_count.toLocaleString()} games</p>
                </div>
              </button>
            ))}
          </div>
        </section>
        
      </div>
    </div>
  );
}
