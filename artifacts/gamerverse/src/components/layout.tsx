import { Navbar } from "./navbar";
import { Link } from "wouter";
import { Gamepad2, Github, Twitter, Youtube, MessageSquare, Instagram } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>

      <footer className="border-t border-white/10 bg-card/50 backdrop-blur-sm pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 group mb-4 w-fit">
                <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors border border-primary/20">
                  <Gamepad2 className="w-6 h-6 text-primary" />
                </div>
                <span className="font-black text-xl tracking-tight text-white">GAMER<span className="text-primary">VERSE</span></span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-xs mb-6 leading-relaxed">
                The ultimate AI-powered gaming discovery engine. Search, compare, and find your next obsession among thousands of titles.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Twitter, label: "Twitter" },
                  { icon: Youtube, label: "YouTube" },
                  { icon: MessageSquare, label: "Discord" },
                  { icon: Github, label: "GitHub" },
                  { icon: Instagram, label: "Instagram" },
                ].map(({ icon: Icon, label }) => (
                  <a key={label} href="#" aria-label={label} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all border border-white/10 hover:border-primary">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Discover */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Discover</h3>
              <ul className="space-y-2.5">
                {[
                  { href: "/", label: "Home" },
                  { href: "/discover", label: "Browse Games" },
                  { href: "/search", label: "Search" },
                  { href: "/collections", label: "Collections" },
                  { href: "/pc-check", label: "PC Compatibility" },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} className="text-muted-foreground hover:text-white transition-colors text-sm">{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Account</h3>
              <ul className="space-y-2.5">
                {[
                  { href: "/profile", label: "My Profile" },
                  { href: "/wishlist", label: "Wishlist" },
                  { href: "/sign-in", label: "Sign In" },
                  { href: "/sign-up", label: "Create Account" },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} className="text-muted-foreground hover:text-white transition-colors text-sm">{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Community & Legal */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Community</h3>
              <ul className="space-y-2.5 mb-6">
                {[
                  { href: "/request-game", label: "Request a Game" },
                  { href: "/request-mod", label: "Request a Mod" },
                  { href: "/sitemap", label: "All Pages" },
                ].map(({ href, label }) => (
                  <li key={href}><Link href={href} className="text-muted-foreground hover:text-white transition-colors text-sm">{label}</Link></li>
                ))}
              </ul>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
              <ul className="space-y-2.5">
                {["Terms of Service", "Privacy Policy", "Cookie Policy", "Contact Us"].map(l => (
                  <li key={l}><a href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} GamerVerse. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Game data provided by <a href="https://rawg.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">RAWG</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
