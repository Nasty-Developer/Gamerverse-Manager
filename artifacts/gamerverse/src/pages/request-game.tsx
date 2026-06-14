import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Send, CheckCircle, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateGameRequest, useListGameRequests, getListGameRequestsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const PLATFORMS = [
  "PC (Steam)", "PC (Epic Games)", "PC (GOG)", "PlayStation 5", "PlayStation 4",
  "Xbox Series X/S", "Xbox One", "Nintendo Switch", "Mobile (iOS)", "Mobile (Android)", "Other"
];

export default function RequestGame() {
  const [gameName, setGameName] = useState("");
  const [platform, setPlatform] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const { data: requests } = useListGameRequests({ query: { queryKey: getListGameRequestsQueryKey() } });

  const createRequest = useCreateGameRequest({
    mutation: {
      onSuccess: () => {
        setSubmitted(true);
        setGameName(""); setPlatform(""); setNotes("");
        queryClient.invalidateQueries({ queryKey: getListGameRequestsQueryKey() });
        setTimeout(() => setSubmitted(false), 4000);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim() || !platform) return;
    createRequest.mutate({ data: { gameName: gameName.trim(), platform, notes: notes.trim() || undefined } });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 mb-4 text-sm font-semibold uppercase tracking-wide">
            <Gamepad2 className="w-4 h-4" /> Request a Game
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Missing a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Game?</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Can't find a game on GamerVerse? Submit a request and we'll add it to the platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-card border border-white/10 rounded-2xl p-8">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-64 text-center gap-4">
                <CheckCircle className="w-16 h-16 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Request Submitted!</h3>
                <p className="text-muted-foreground">We'll review your request and add the game soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="gameName" className="text-white font-medium">Game Name *</Label>
                  <Input
                    id="gameName"
                    value={gameName}
                    onChange={e => setGameName(e.target.value)}
                    placeholder="e.g. Hollow Knight"
                    className="bg-background border-white/10 text-white placeholder:text-muted-foreground focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-medium">Platform *</Label>
                  <Select value={platform} onValueChange={setPlatform} required>
                    <SelectTrigger className="bg-background border-white/10 text-white">
                      <SelectValue placeholder="Select platform..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {PLATFORMS.map(p => (
                        <SelectItem key={p} value={p} className="text-white hover:bg-white/5">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white font-medium">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Any other details about the game, why it should be added, etc."
                    className="bg-background border-white/10 text-white placeholder:text-muted-foreground focus:border-primary min-h-[100px]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!gameName.trim() || !platform || createRequest.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {createRequest.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            )}
          </div>

          {/* Recent requests */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Requests
            </h2>
            <div className="space-y-3">
              {requests && requests.length > 0 ? requests.slice(0, 8).map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-card border border-white/10 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-semibold">{req.gameName}</p>
                    <p className="text-muted-foreground text-sm">{req.platform}</p>
                  </div>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                    req.status === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                    req.status === "approved" ? "bg-green-500/20 text-green-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {req.status}
                  </span>
                </motion.div>
              )) : (
                <div className="text-muted-foreground text-center py-12 bg-card border border-white/10 rounded-xl">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No requests yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
