import { useUser, SignOutButton } from "@clerk/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameCard } from "@/components/game-card";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Heart, Clock, Sparkles } from "lucide-react";
import { 
  useListFavorites, 
  useListRecentlyViewed, 
  useGetRecommendations,
  getListFavoritesQueryKey,
  getListRecentlyViewedQueryKey,
  getGetRecommendationsQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

interface ParsedGame {
  id: number;
  slug: string;
  name: string;
  background_image?: string | null;
  rating: number;
  rating_top: number;
  ratings_count: number;
  playtime: number;
  genres: { id: number; name: string; slug: string }[];
  platforms: { platform: { id: number; name: string; slug: string } }[];
  tags: { id: number; name: string; slug: string }[];
  short_screenshots?: { id: number; image: string }[];
  released?: string;
  metacritic?: number;
}

interface DbItem {
  id: number;
  gameSlug: string;
  gameName: string;
  gameBackground?: string | null;
  gameRating: number;
  gameGenres?: string;
}

function parseGameFromDb(item: DbItem): ParsedGame {
  const genreStr = item.gameGenres || "";
  return {
    id: item.id,
    slug: item.gameSlug,
    name: item.gameName,
    background_image: item.gameBackground || null,
    rating: item.gameRating,
    rating_top: 5,
    ratings_count: 0,
    playtime: 0,
    genres: genreStr ? genreStr.split(",").map((g: string) => ({ id: 0, name: g.trim(), slug: g.trim() })) : [],
    platforms: [],
    tags: [],
  };
}

export default function Profile() {
  const { user, isLoaded } = useUser();

  const { data: favorites, isLoading: loadingFavs } = useListFavorites({
    query: { enabled: isLoaded, queryKey: getListFavoritesQueryKey() }
  });
  const { data: recent, isLoading: loadingRecent } = useListRecentlyViewed({
    query: { enabled: isLoaded, queryKey: getListRecentlyViewedQueryKey() }
  });
  
  const favGenres = favorites?.flatMap(f => (f.gameGenres || "").split(",").map((s: string) => s.trim().toLowerCase())).filter(Boolean) || [];
  const popularGenre = favGenres.length > 0 ? favGenres[0] : "";
  
  const { data: recommendations, isLoading: loadingRecs } = useGetRecommendations(
    { genres: popularGenre, page_size: 6 },
    { query: { enabled: !!popularGenre, queryKey: getGetRecommendationsQueryKey({ genres: popularGenre, page_size: 6 }) } }
  );

  if (!isLoaded || !user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="w-full max-w-3xl h-64 mx-auto rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-card border border-white/10 rounded-3xl p-8 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          
          <img src={user.imageUrl} alt={user.fullName || "User"} className="w-32 h-32 rounded-full border-4 border-background shadow-xl" />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-white mb-2">{user.fullName || user.username || "Gamer"}</h1>
            <p className="text-muted-foreground mb-6">{user.primaryEmailAddress?.emailAddress}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
              <div className="bg-background border border-white/5 px-4 py-2 rounded-lg">
                <span className="block text-2xl font-bold text-white">{favorites?.length || 0}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Favorites</span>
              </div>
              <div className="bg-background border border-white/5 px-4 py-2 rounded-lg">
                <span className="block text-2xl font-bold text-white">{recent?.length || 0}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Viewed</span>
              </div>
            </div>
          </div>

          <SignOutButton>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </SignOutButton>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="bg-background border border-white/10 p-1 w-full flex overflow-x-auto h-14 mb-8">
            <TabsTrigger value="favorites" className="flex-1 data-[state=active]:bg-card data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" /> Favorites
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex-1 data-[state=active]:bg-card data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" /> History
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex-1 data-[state=active]:bg-card data-[state=active]:text-white">
              <Sparkles className="w-4 h-4 mr-2" /> For You
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="mt-0 outline-none">
            {loadingFavs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl bg-white/5" />)}
              </div>
            ) : favorites?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map(f => (
                  <GameCard key={f.id} game={parseGameFromDb(f)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-card border border-white/10 rounded-xl">
                <Heart className="w-12 h-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">No favorites yet</h3>
                <p className="text-muted-foreground">Start exploring and save games you love.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-0 outline-none">
            {loadingRecent ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl bg-white/5" />)}
               </div>
            ) : recent?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recent.map(r => (
                  <GameCard key={r.id} game={parseGameFromDb(r)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-card border border-white/10 rounded-xl">
                <Clock className="w-12 h-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">No history</h3>
                <p className="text-muted-foreground">Games you view will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="mt-0 outline-none">
            {loadingRecs ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {[1,2,3,4].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl bg-white/5" />)}
               </div>
            ) : recommendations?.results?.length ? (
              <div>
                <p className="text-muted-foreground mb-6">Based on your favorite genres: <strong className="text-white">{recommendations.based_on}</strong></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {recommendations.results.map(r => (
                    <GameCard key={r.game.id} game={r.game} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-24 bg-card border border-white/10 rounded-xl">
                <Sparkles className="w-12 h-12 text-muted-foreground opacity-50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">Need more data</h3>
                <p className="text-muted-foreground">Favorite some games to get personalized recommendations.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
