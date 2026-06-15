import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, Compass, Search, Cpu, User, Bookmark, LayoutGrid, Gamepad2, Wrench, Map, ArrowRight, Scale } from "lucide-react";

const ROUTES = [
  {
    section: "Core Pages",
    color: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
    textColor: "text-primary",
    links: [
      { href: "/", icon: Home, label: "Home", description: "Cinematic homepage with trending, new, and top-rated games" },
      { href: "/discover", icon: Compass, label: "Discover", description: "Browse the full game catalog with filters and sorting" },
      { href: "/search", icon: Search, label: "Search", description: "Natural language search — 'best open world RPGs', etc." },
    ]
  },
  {
    section: "Tools",
    color: "from-accent/20 to-accent/5",
    borderColor: "border-accent/30",
    textColor: "text-accent",
    links: [
      { href: "/pc-check", icon: Cpu, label: "Can I Run It?", description: "Check PC hardware compatibility for any game" },
      { href: "/compare", icon: Scale, label: "Compare Games", description: "Compare up to 4 games side by side — ratings, metacritic, platforms" },
      { href: "/collections", icon: LayoutGrid, label: "Collections", description: "Curated game lists — best RPGs, horror, open world, and more" },
    ]
  },
  {
    section: "Account",
    color: "from-green-500/20 to-green-500/5",
    borderColor: "border-green-500/30",
    textColor: "text-green-400",
    links: [
      { href: "/profile", icon: User, label: "Profile", description: "Your favorites, recently viewed, and recommendations" },
      { href: "/wishlist", icon: Bookmark, label: "Wishlist", description: "Save games you want to play later" },
    ]
  },
  {
    section: "Community",
    color: "from-orange-500/20 to-orange-500/5",
    borderColor: "border-orange-500/30",
    textColor: "text-orange-400",
    links: [
      { href: "/request-game", icon: Gamepad2, label: "Request a Game", description: "Submit missing games to be added to the platform" },
      { href: "/request-mod", icon: Wrench, label: "Request a Mod", description: "Request and vote on mod links for your favorite games" },
    ]
  },
];

export default function Sitemap() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 mb-4 text-sm font-semibold uppercase tracking-wide">
            <Map className="w-4 h-4" /> All Pages
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            GamerVerse <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Sitemap</span>
          </h1>
          <p className="text-muted-foreground text-lg">Every page and feature available on GamerVerse.</p>
        </div>

        <div className="space-y-8">
          {ROUTES.map((section, si) => (
            <motion.div key={section.section} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}>
              <h2 className={`text-xl font-bold mb-4 ${section.textColor}`}>{section.section}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div className={`group bg-gradient-to-br ${section.color} border ${section.borderColor} rounded-2xl p-5 cursor-pointer hover:scale-[1.01] transition-transform`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg bg-white/5 ${section.textColor}`}>
                          <link.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-bold text-white group-hover:text-primary transition-colors">{link.label}</h3>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </div>
                          <p className="text-muted-foreground text-sm mt-1">{link.description}</p>
                          <p className={`text-xs mt-2 font-mono ${section.textColor} opacity-70`}>{link.href}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Developer Report */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 bg-card border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 font-mono">Developer Route Report</h2>
          <div className="space-y-2 font-mono text-sm">
            {[
              ["GET", "/", "Home — trending, new releases, top rated, genres"],
              ["GET", "/discover", "Discover — full catalog with genre/platform filters"],
              ["GET", "/search", "Search — NLP intent parsing with RAWG"],
              ["GET", "/games/:slug", "Game Detail — hero, screenshots, similar games"],
              ["GET", "/pc-check", "PC Check — hardware compatibility verdict"],
              ["GET", "/collections", "Collections — all curated game lists"],
              ["GET", "/collections/:slug", "Collection Detail — games in a specific list"],
              ["GET", "/wishlist", "Wishlist — user's saved games (auth required)"],
              ["GET", "/profile", "Profile — favorites, history, recommendations (auth required)"],
              ["GET", "/request-game", "Request Game — submit missing games"],
              ["GET", "/request-mod", "Request Mod — submit and vote on mod requests"],
              ["GET", "/sitemap", "Sitemap — all available routes (this page)"],
              ["GET", "/sign-in", "Auth — Clerk sign in"],
              ["GET", "/sign-up", "Auth — Clerk sign up"],
            ].map(([method, path, desc]) => (
              <div key={path} className="flex gap-3 items-start py-1 border-b border-white/5">
                <span className="text-green-400 w-10 flex-shrink-0">{method}</span>
                <span className="text-primary w-52 flex-shrink-0">{path}</span>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
