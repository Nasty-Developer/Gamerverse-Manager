import { Navbar } from "./navbar";
import { Link } from "wouter";
import { Gamepad2, Github, Twitter, Youtube } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      
      <footer className="border-t border-white/10 bg-card py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 group mb-4">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-primary" />
                </div>
                <span className="font-black text-xl tracking-tight text-white">GAMER<span className="text-primary">VERSE</span></span>
              </Link>
              <p className="text-muted-foreground max-w-sm mb-6">
                Discover. Compare. Play. The ultimate AI-powered gaming discovery engine. 
                Find your next obsession among thousands of titles.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><Link href="/discover" className="text-muted-foreground hover:text-white transition-colors">Discover</Link></li>
                <li><Link href="/search" className="text-muted-foreground hover:text-white transition-colors">Search Games</Link></li>
                <li><Link href="/pc-check" className="text-muted-foreground hover:text-white transition-colors">PC Requirements</Link></li>
                <li><Link href="/profile" className="text-muted-foreground hover:text-white transition-colors">My Profile</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GamerVerse. All rights reserved. Data provided by RAWG.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
