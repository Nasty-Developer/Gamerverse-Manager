import { motion } from "framer-motion";
import { Bookmark, Trash2, Star, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useListWishlist, useRemoveFromWishlist, getListWishlistQueryKey } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";

export default function Wishlist() {
  const { isSignedIn, isLoaded } = useUser();
  const queryClient = useQueryClient();
  const { data: wishlist, isLoading } = useListWishlist({ query: { enabled: !!isSignedIn, queryKey: getListWishlistQueryKey() } });
  const remove = useRemoveFromWishlist({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListWishlistQueryKey() }) }
  });

  if (isLoaded && !isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <Bookmark className="w-16 h-16 text-primary mx-auto mb-6 opacity-50" />
        <h1 className="text-3xl font-black text-white mb-4">Your Wishlist</h1>
        <p className="text-muted-foreground mb-8">Sign in to save games to your wishlist.</p>
        <Link href="/sign-in">
          <Button className="bg-primary hover:bg-primary/90 text-white px-8">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-primary" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground">Games you want to play</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full rounded-xl bg-white/5" />
                <Skeleton className="h-4 w-3/4 bg-white/5" />
                <Skeleton className="h-4 w-1/2 bg-white/5" />
              </div>
            ))}
          </div>
        ) : wishlist && wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-card border border-white/10 rounded-xl overflow-hidden"
              >
                <Link href={`/games/${item.gameSlug}`}>
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {item.gameBackground ? (
                      <img src={item.gameBackground} alt={item.gameName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-card to-background flex items-center justify-center">
                        <Bookmark className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-1">{item.gameName}</h3>
                    {item.gameRating > 0 && (
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{item.gameRating.toFixed(1)}</span>
                      </div>
                    )}
                    {item.gameGenres && (
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-1">{item.gameGenres}</p>
                    )}
                  </div>
                </Link>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove.mutate({ gameSlug: item.gameSlug })}
                    className="w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm border border-white/10 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <Link href={`/games/${item.gameSlug}`}>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm border border-white/10 hover:bg-primary/20">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <Bookmark className="w-20 h-20 text-primary mx-auto mb-6 opacity-30" />
            <h2 className="text-2xl font-bold text-white mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Browse games and add them to your wishlist to track what you want to play.</p>
            <Link href="/discover">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8">Browse Games</Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
