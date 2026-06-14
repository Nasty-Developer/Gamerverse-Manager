import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, SignIn, SignUp } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Search from "@/pages/search";
import Discover from "@/pages/discover";
import GameDetail from "@/pages/game-detail";
import PcCheck from "@/pages/pc-check";
import Profile from "@/pages/profile";
import Collections from "@/pages/collections";
import CollectionDetail from "@/pages/collection-detail";
import Wishlist from "@/pages/wishlist";
import RequestGame from "@/pages/request-game";
import RequestMod from "@/pages/request-mod";
import Sitemap from "@/pages/sitemap";
import { Layout } from "@/components/layout";

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

const clerkAppearance = {
  cssLayerName: "clerk",
  variables: {
    colorPrimary: "hsl(221, 83%, 53%)",
    colorForeground: "hsl(210, 40%, 95%)",
    colorMutedForeground: "hsl(215, 20.2%, 65.1%)",
    colorDanger: "hsl(0, 62.8%, 30.6%)",
    colorBackground: "hsl(222, 47%, 8%)",
    colorInput: "hsl(217, 33%, 20%)",
    colorInputForeground: "hsl(210, 40%, 95%)",
    colorNeutral: "hsl(217, 33%, 20%)",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    cardBox: "bg-card rounded-2xl w-[440px] max-w-full overflow-hidden border border-border shadow-2xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-2xl font-bold text-foreground",
    headerSubtitle: "text-muted-foreground",
    formFieldLabel: "text-foreground font-medium",
    formFieldInput: "bg-input border-border text-foreground rounded-md",
    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground transition-colors",
    footerActionText: "text-muted-foreground",
    footerActionLink: "text-primary hover:text-primary/90 font-medium",
  },
};

const authBg = {
  backgroundImage: "linear-gradient(to bottom, rgba(10, 10, 15, 0.8), rgba(10, 10, 15, 1)), url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')",
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 bg-cover bg-center" style={authBg}>
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12 bg-cover bg-center" style={authBg}>
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/search" component={Search} />
        <Route path="/discover" component={Discover} />
        <Route path="/games/:slug" component={GameDetail} />
        <Route path="/pc-check" component={PcCheck} />
        <Route path="/profile" component={Profile} />
        <Route path="/collections" component={Collections} />
        <Route path="/collections/:slug" component={CollectionDetail} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/request-game" component={RequestGame} />
        <Route path="/request-mod" component={RequestMod} />
        <Route path="/sitemap" component={Sitemap} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey || ""}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <Router />
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <ClerkProviderWithRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
