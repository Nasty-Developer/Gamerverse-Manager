import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useListCollections, getListCollectionsQueryKey } from "@workspace/api-client-react";

export default function Collections() {
  const { data: collections, isLoading } = useListCollections({ query: { queryKey: getListCollectionsQueryKey() } });

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 mb-4 text-sm font-semibold uppercase tracking-wide">
            <LayoutGrid className="w-4 h-4" /> Curated Collections
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Handpicked <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Game Lists</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Expertly curated game collections for every type of gamer.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections?.map((col, i) => (
              <motion.div
                key={col.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/collections/${col.slug}`}>
                  <div className="group relative bg-card border border-white/10 rounded-2xl p-6 h-40 flex flex-col justify-between overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                    <div>
                      <span className="text-4xl">{col.emoji}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-1">{col.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-1">{col.description}</p>
                    </div>
                    <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1 duration-200" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
