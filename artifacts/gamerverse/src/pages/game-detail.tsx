import { useParams, Link } from "wouter";
import { useEffect } from "react";
import { Star, MonitorPlay, Calendar, Users, Building, ShieldAlert, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "@/components/game-card";
import { 
  useGetGame, 
  useGetGameScreenshots, 
  useGetSimilarGames,
  useTrackRecentlyViewed,
  getGetGameQueryKey,
  getGetGameScreenshotsQueryKey,
  getGetSimilarGamesQueryKey,
} from "@workspace/api-client-react";
import { useUser } from "@clerk/react";

export default function GameDetail() {
  const params = useParams();
  const slug = params.slug || "";
  const { isSignedIn } = useUser();
  const trackViewed = useTrackRecentlyViewed();

  const { data: game, isLoading, error } = useGetGame(slug, {
    query: { enabled: !!slug, queryKey: getGetGameQueryKey(slug) }
  });

  const { data: screenshots } = useGetGameScreenshots(slug, {
    query: { enabled: !!slug, queryKey: getGetGameScreenshotsQueryKey(slug) }
  });

  const { data: similar } = useGetSimilarGames(slug, {
    query: { enabled: !!slug, queryKey: getGetSimilarGamesQueryKey(slug) }
  });

  useEffect(() => {
    if (game && isSignedIn) {
      trackViewed.mutate({
        data: {
          gameSlug: game.slug,
          gameName: game.name,
          gameBackground: game.background_image || undefined,
          gameRating: game.rating,
          gameGenres: game.genres.map(g => g.name).join(", ")
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.slug, isSignedIn]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="w-full h-[60vh] bg-white/5 rounded-none" />
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <Skeleton className="w-64 h-12 bg-white/10 rounded-lg mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full h-64 bg-white/5 rounded-xl" />
            </div>
            <Skeleton className="w-full h-96 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return <div className="text-center py-24 text-white">Game not found</div>;
  }

  const metacriticColor = 
    !game.metacritic ? "bg-muted text-muted-foreground" :
    game.metacritic >= 80 ? "bg-green-500/20 text-green-400 border border-green-500/50" :
    game.metacritic >= 60 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" :
    "bg-red-500/20 text-red-400 border border-red-500/50";

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        {game.background_image ? (
          <>
            <img src={game.background_image} alt={game.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-black/30" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-card to-background" />
        )}
        
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container mx-auto px-4 pb-12">
            <div className="flex flex-wrap gap-3 mb-4">
              {game.genres.map(g => (
                <span key={g.id} className="px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-md">
                  {g.name}
                </span>
              ))}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-lg mb-6">{game.name}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold">{game.rating.toFixed(1)}</span>
                <span className="text-muted-foreground text-sm ml-1">({game.ratings_count.toLocaleString()})</span>
              </div>
              
              {game.metacritic && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md border ${metacriticColor}`}>
                  <span className="text-2xl font-black">{game.metacritic}</span>
                  <span className="text-sm uppercase font-bold tracking-wider opacity-80">Metascore</span>
                </div>
              )}
              
              {game.released && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{new Date(game.released).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">About this game</h2>
              <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-relaxed" 
                   dangerouslySetInnerHTML={{ __html: (game.description_raw || "").replace(/\n/g, '<br/>') }} />
            </section>

            {screenshots?.results && screenshots.results.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
                <div className="flex overflow-x-auto gap-4 pb-6 custom-scrollbar snap-x">
                  {screenshots.results.map(shot => (
                    <img 
                      key={shot.id} 
                      src={shot.image} 
                      alt="Screenshot" 
                      className="h-64 object-cover rounded-xl border border-white/10 snap-center shrink-0" 
                    />
                  ))}
                </div>
              </section>
            )}

            {similar?.results && similar.results.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">Similar Games</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similar.results.slice(0, 6).map(g => (
                    <GameCard key={g.id} game={g} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-card border border-white/10 rounded-2xl p-6 shadow-xl sticky top-24">
              <Link href={`/pc-check?game=${game.slug}`}>
                <Button size="lg" className="w-full mb-8 h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <Cpu className="w-5 h-5 mr-2" /> Can I Run This?
                </Button>
              </Link>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <MonitorPlay className="w-4 h-4" /> Platforms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {game.platforms.map(p => (
                      <span key={p.platform.id} className="text-sm bg-white/5 px-2 py-1 rounded border border-white/10 text-white">
                        {p.platform.name}
                      </span>
                    ))}
                  </div>
                </div>

                {game.developers && game.developers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Building className="w-4 h-4" /> Developer
                    </h3>
                    <p className="text-white font-medium">{game.developers.map(d => d.name).join(", ")}</p>
                  </div>
                )}

                {game.publishers && game.publishers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Publisher
                    </h3>
                    <p className="text-white font-medium">{game.publishers.map(p => p.name).join(", ")}</p>
                  </div>
                )}

                {game.esrb_rating?.name && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Age Rating
                    </h3>
                    <p className="text-white font-medium">{game.esrb_rating.name}</p>
                  </div>
                )}
                
                {game.website && (
                  <div className="pt-4 border-t border-white/10">
                    <a href={game.website} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
                      Visit Official Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
