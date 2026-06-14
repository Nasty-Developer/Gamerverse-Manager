import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/game-card";
import { useGetCollection, getGetCollectionQueryKey } from "@workspace/api-client-react";

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: collection, isLoading, isError } = useGetCollection(slug, {
    query: { queryKey: getGetCollectionQueryKey(slug) }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !collection) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-black text-white mb-4">Collection Not Found</h1>
        <Link href="/collections">
          <Button variant="ghost"><ArrowLeft className="w-4 h-4 mr-2" />Back to Collections</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link href="/collections">
          <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Collections
          </Button>
        </Link>

        <div className="mb-10">
          <div className="text-5xl mb-4">{collection.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">{collection.title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-2">{collection.description}</p>
          <p className="text-sm text-muted-foreground">{collection.count.toLocaleString()} games</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {collection.results?.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
