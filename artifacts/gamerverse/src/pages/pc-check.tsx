import { useState } from "react";
import { Cpu, CheckCircle2, AlertTriangle, XCircle, HardDrive, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckPcCompatibility, useGetGame, getGetGameQueryKey } from "@workspace/api-client-react";

interface PcCheckDetail {
  component: string;
  status: "pass" | "warn" | "fail";
  message: string;
}

interface PcCheckResult {
  gameSlug: string;
  gameName: string;
  result: "can_run" | "may_run" | "not_recommended";
  explanation: string;
  minimumRequirements?: string;
  recommendedRequirements?: string;
  details: PcCheckDetail[];
}

export default function PcCheck() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialSlug = searchParams.get("game") || "";
  
  const [gameSlug, setGameSlug] = useState(initialSlug);
  const [cpu, setCpu] = useState("");
  const [gpu, setGpu] = useState("");
  const [ram, setRam] = useState("");
  const [result, setResult] = useState<PcCheckResult | null>(null);

  const checkMutation = useCheckPcCompatibility();
  const { data: gameInfo } = useGetGame(initialSlug, {
    query: { enabled: !!initialSlug, queryKey: getGetGameQueryKey(initialSlug) }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameSlug || !cpu || !gpu || !ram) return;
    
    checkMutation.mutate({
      data: {
        gameSlug,
        cpu,
        gpu,
        ram: Number(ram)
      }
    }, {
      onSuccess: (data) => setResult(data as PcCheckResult)
    });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6 border border-primary/20">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight mb-4">Hardware Scanner</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze your rig to see if it can handle the most demanding next-gen titles.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <div className="bg-card border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            
            {gameInfo && (
              <div className="mb-8 p-4 bg-white/5 rounded-lg border border-white/10 flex items-center gap-4">
                {gameInfo.background_image && (
                  <img src={gameInfo.background_image} alt={gameInfo.name} className="w-16 h-16 rounded object-cover" />
                )}
                <div>
                  <h3 className="text-sm text-muted-foreground uppercase tracking-wider font-bold">Target Game</h3>
                  <p className="text-lg font-bold text-white">{gameInfo.name}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {!initialSlug && (
                <div className="space-y-2">
                  <Label htmlFor="gameSlug" className="text-white font-medium">Game Title / Slug</Label>
                  <Input 
                    id="gameSlug" 
                    value={gameSlug} 
                    onChange={e => setGameSlug(e.target.value)} 
                    placeholder="e.g. cyberpunk-2077"
                    className="bg-background border-white/10 text-white h-12"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="cpu" className="text-white font-medium flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" /> CPU Processor
                </Label>
                <Input 
                  id="cpu" 
                  value={cpu} 
                  onChange={e => setCpu(e.target.value)} 
                  placeholder="e.g. Intel Core i7-10700K or AMD Ryzen 7 3700X"
                  className="bg-background border-white/10 text-white h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpu" className="text-white font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent" /> Graphics Card
                </Label>
                <Input 
                  id="gpu" 
                  value={gpu} 
                  onChange={e => setGpu(e.target.value)} 
                  placeholder="e.g. NVIDIA RTX 3080 or AMD RX 6800 XT"
                  className="bg-background border-white/10 text-white h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ram" className="text-white font-medium flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-green-500" /> RAM (GB)
                </Label>
                <Input 
                  id="ram" 
                  type="number"
                  min="4"
                  max="256"
                  value={ram} 
                  onChange={e => setRam(e.target.value)} 
                  placeholder="e.g. 16"
                  className="bg-background border-white/10 text-white h-12"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90"
                disabled={checkMutation.isPending}
              >
                {checkMutation.isPending ? "Scanning Hardware..." : "Run Diagnostics"}
              </Button>
            </form>
          </div>

          {/* Results */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-white/10 rounded-2xl p-8 shadow-2xl"
                >
                  <div className="text-center mb-8 pb-8 border-b border-white/10">
                    {result.result === "can_run" && (
                      <>
                        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                        <h2 className="text-3xl font-black text-green-500 mb-2 tracking-tight">SYSTEM READY</h2>
                      </>
                    )}
                    {result.result === "may_run" && (
                      <>
                        <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                        <h2 className="text-3xl font-black text-yellow-500 mb-2 tracking-tight">PARTIAL MATCH</h2>
                      </>
                    )}
                    {result.result === "not_recommended" && (
                      <>
                        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                        <h2 className="text-3xl font-black text-red-500 mb-2 tracking-tight">UPGRADE REQUIRED</h2>
                      </>
                    )}
                    <p className="text-muted-foreground mt-4 text-lg">{result.explanation}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm mb-4">Component Breakdown</h3>
                    {result.details.map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
                        <div className="mt-1">
                          {detail.status === "pass" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                          {detail.status === "warn" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                          {detail.status === "fail" && <XCircle className="w-5 h-5 text-red-500" />}
                        </div>
                        <div>
                          <div className="font-medium text-white mb-1">{detail.component}</div>
                          <div className="text-sm text-muted-foreground">{detail.message}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {result.minimumRequirements && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Minimum Requirements</h4>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-white/5 p-3 rounded-lg">{result.minimumRequirements}</pre>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-2xl bg-card/30"
                >
                  <Cpu className="w-16 h-16 text-muted-foreground opacity-30 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Awaiting Input</h3>
                  <p className="text-center text-muted-foreground">
                    Enter your system specs to see if you can run the game smoothly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
