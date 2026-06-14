import { Link } from "wouter";
import { Gamepad2, Search, Compass, Cpu, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useUser, UserButton } from "@clerk/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const navLinks = [
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/search", label: "Search", icon: Search },
    { href: "/pc-check", label: "Can I Run It?", icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">GAMER<span className="text-primary">VERSE</span></span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 rounded-full transition-all">
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            {isLoaded && (
              isSignedIn ? (
                <div className="flex items-center gap-4">
                  <Link href="/profile" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">Profile</Link>
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                </div>
              ) : (
                <Link href="/sign-in" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  Sign In
                </Link>
              )
            )}
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-white/10 w-[300px] p-6">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-muted-foreground hover:text-white transition-colors">
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                
                <div className="h-px bg-white/10 my-2" />
                
                {isLoaded && (
                  isSignedIn ? (
                    <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-lg font-medium text-muted-foreground hover:text-white transition-colors">
                      <User className="w-5 h-5" />
                      Profile
                    </Link>
                  ) : (
                    <Link href="/sign-in" onClick={() => setIsOpen(false)} className="flex items-center justify-center h-12 rounded-md bg-primary text-primary-foreground font-medium w-full">
                      Sign In
                    </Link>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
