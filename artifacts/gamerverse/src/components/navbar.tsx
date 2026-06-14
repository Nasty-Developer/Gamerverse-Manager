import { Link, useLocation } from "wouter";
import { Gamepad2, Search, Compass, Cpu, User, Menu, Bookmark, LayoutGrid, Gamepad, Wrench, Map, Home, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useUser, UserButton } from "@clerk/react";

const navLinks = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/discover", icon: Compass, label: "Discover" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/collections", icon: LayoutGrid, label: "Collections" },
  { href: "/pc-check", icon: Cpu, label: "Can I Run It?" },
];

const mobileExtraLinks = [
  { href: "/wishlist", icon: Bookmark, label: "Wishlist" },
  { href: "/request-game", icon: Gamepad, label: "Request Game" },
  { href: "/request-mod", icon: Wrench, label: "Request Mod" },
  { href: "/sitemap", icon: Map, label: "All Pages" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const [location] = useLocation();

  const isActive = (href: string) => href === "/" ? location === "/" : location.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group mr-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-md rounded-lg group-hover:bg-primary/60 transition-colors" />
              <div className="relative bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors border border-primary/30">
                <Gamepad2 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <span className="font-black text-lg tracking-tight text-white hidden sm:block">GAMER<span className="text-primary">VERSE</span></span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-full transition-all ${
                  isActive(link.href)
                    ? "text-white bg-white/10"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-muted-foreground hover:text-white">
                <Bookmark className="w-4 h-4" />
                <span className="sr-only">Wishlist</span>
              </Button>
            </Link>
            <Link href="/request-game">
              <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-white text-xs hidden xl:flex">
                <Gamepad className="w-3.5 h-3.5 mr-1.5" />
                Request Game
              </Button>
            </Link>
          </div>

          {isLoaded && (
            isSignedIn ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/profile" className={`text-sm font-medium transition-colors ${isActive("/profile") ? "text-white" : "text-muted-foreground hover:text-white"}`}>
                  <User className="w-4 h-4" />
                </Link>
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
              </div>
            ) : (
              <Link href="/sign-in" className="hidden md:inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Sign In
              </Link>
            )
          )}

          {/* Mobile menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-white w-9 h-9 rounded-full">
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-white/10 w-[280px] p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-white/10">
                  <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                    <Gamepad2 className="w-6 h-6 text-primary" />
                    <span className="font-black text-lg text-white">GAMER<span className="text-primary">VERSE</span></span>
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-3 py-2">Navigation</p>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
                        isActive(link.href)
                          ? "text-white bg-white/10"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}

                  <div className="h-px bg-white/10 my-3" />
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-3 py-2">More</p>
                  {mobileExtraLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
                        isActive(link.href)
                          ? "text-white bg-white/10"
                          : "text-muted-foreground hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="p-4 border-t border-white/10">
                  {isLoaded && (
                    isSignedIn ? (
                      <div className="flex items-center gap-3">
                        <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                        <Link href="/profile" onClick={() => setIsOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
                          My Profile
                        </Link>
                      </div>
                    ) : (
                      <Link href="/sign-in" onClick={() => setIsOpen(false)} className="flex items-center justify-center h-12 rounded-xl bg-primary text-primary-foreground font-semibold w-full">
                        Sign In
                      </Link>
                    )
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
