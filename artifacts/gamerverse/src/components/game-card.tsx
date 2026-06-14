import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import { useAddFavorite, useRemoveFavorite, useListFavorites, getListFavoritesQueryKey, type GameSummary } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { Button } from "@/components/ui/button";

export type { GameSummary };

export function GameCard({ game }: { game: GameSummary }) {
  const { isSignedIn } = useUser();
  const { data: favorites } = useListFavorites({
    query: { enabled: !!isSignedIn, queryKey: getListFavoritesQueryKey() }
  });
  
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const isFavorite = favorites?.some((f: { gameSlug: string }) => f.gameSlug === game.slug);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) return;
    
    if (isFavorite) {
      removeFavorite.mutate({ gameSlug: game.slug });
    } else {
      addFavorite.mutate({
        data: {
          gameSlug: game.slug,
          gameName: game.name,
          gameBackground: game.background_image || undefined,
          gameRating: game.rating,
          gameGenres: game.genres.map(g => g.name).join(", ")
        }
      });
    }
  };

  const metacriticColor = 
    !game.metacritic ? "bg-muted text-muted-foreground" :
    game.metacritic >= 80 ? "bg-green-500/20 text-green-400 border border-green-500/50" :
    game.metacritic >= 60 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" :
    "bg-red-500/20 text-red-400 border border-red-500/50";

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col bg-card border border-white/5 rounded-xl overflow-hidden shadow-lg h-full"
    >
      <Link href={`/games/${game.slug}`} className="flex-1 flex flex-col">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {game.background_image ? (
            <img 
              src={game.background_image} 
              alt={game.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-card to-background flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2">
            {game.metacritic && (
              <div className={`px-2 py-1 rounded font-bold text-xs backdrop-blur-md ${metacriticColor}`}>
                {game.metacritic}
              </div>
            )}
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        </div>
        
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-lg leading-tight line-clamp-2 text-white group-hover:text-primary transition-colors mb-2">
            {game.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-yellow-400 text-sm font-medium">
              <Star className="w-4 h-4 mr-1 fill-current" />
              {game.rating > 0 ? game.rating.toFixed(1) : "N/A"}
            </div>
            {game.released && (
              <>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-muted-foreground text-xs">
                  {new Date(game.released).getFullYear()}
                </span>
              </>
            )}
          </div>
          
          <div className="mt-auto pt-4 flex flex-wrap gap-1">
            {game.genres.slice(0, 3).map(genre => (
              <span key={genre.id} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white/5 text-muted-foreground rounded-full">
                {genre.name}
              </span>
            ))}
            {game.genres.length > 3 && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white/5 text-muted-foreground rounded-full">
                +{game.genres.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {isSignedIn && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteClick}
          data-testid="button-favorite-toggle"
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-background/50 backdrop-blur-md border border-white/10 hover:bg-background/80"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          <span className="sr-only">Toggle Favorite</span>
        </Button>
      )}
    </motion.div>
  );
}
