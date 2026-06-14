import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Send, CheckCircle, ThumbsUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateModRequest, useListModRequests, useVoteModRequest, getListModRequestsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const MOD_CATEGORIES = ["Gameplay", "Graphics / Visuals", "UI / HUD", "Audio", "Performance", "Cheats / Trainers", "Cosmetics", "Maps / Levels", "Overhaul", "Other"];
const STATUS_COLORS: Record<string, string> = {
  requested: "bg-blue-500/20 text-blue-400",
  "under-review": "bg-yellow-500/20 text-yellow-400",
  available: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

export default function RequestMod() {
  const [gameName, setGameName] = useState("");
  const [modName, setModName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const { data: requests } = useListModRequests({ query: { queryKey: getListModRequestsQueryKey() } });
  const createRequest = useCreateModRequest({
    mutation: {
      onSuccess: () => {
        setSubmitted(true);
        setGameName(""); setModName(""); setDescription(""); setCategory("");
        queryClient.invalidateQueries({ queryKey: getListModRequestsQueryKey() });
        setTimeout(() => setSubmitted(false), 4000);
      }
    }
  });
  const vote = useVoteModRequest({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListModRequestsQueryKey() }) }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim() || !modName.trim() || !description.trim() || !category) return;
    createRequest.mutate({ data: { gameName: gameName.trim(), modName: modName.trim(), description: description.trim(), category } });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/30 mb-4 text-sm font-semibold uppercase tracking-wide">
            <Wrench className="w-4 h-4" /> Request a Mod
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Request a <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Mod Link</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Know a great mod that's missing? Submit it and the community can vote it up.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-card border border-white/10 rounded-2xl p-8">
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-64 text-center gap-4">
                <CheckCircle className="w-16 h-16 text-green-400" />
                <h3 className="text-2xl font-bold text-white">Mod Submitted!</h3>
                <p className="text-muted-foreground">Your request is live. The community can vote it up!</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-white font-medium">Game Name *</Label>
                  <Input value={gameName} onChange={e => setGameName(e.target.value)} placeholder="e.g. Skyrim" className="bg-background border-white/10 text-white placeholder:text-muted-foreground" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Mod Name *</Label>
                  <Input value={modName} onChange={e => setModName(e.target.value)} placeholder="e.g. SkyUI" className="bg-background border-white/10 text-white placeholder:text-muted-foreground" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="bg-background border-white/10 text-white">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {MOD_CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-white hover:bg-white/5">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-medium">Description *</Label>
                  <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what this mod does and why it's useful..." className="bg-background border-white/10 text-white placeholder:text-muted-foreground min-h-[100px]" required />
                </div>
                <Button type="submit" disabled={!gameName || !modName || !description || !category || createRequest.isPending} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl">
                  <Send className="w-4 h-4 mr-2" />
                  {createRequest.isPending ? "Submitting..." : "Submit Mod Request"}
                </Button>
              </form>
            )}
          </div>

          {/* Top requests */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" /> Top Mod Requests
            </h2>
            <div className="space-y-3">
              {requests && requests.length > 0 ? requests.slice(0, 8).map((req) => (
                <motion.div key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-white/10 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">{req.modName}</p>
                      <p className="text-muted-foreground text-sm">{req.gameName} • {req.category}</p>
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-1">{req.description}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => vote.mutate({ id: req.id })} className="w-8 h-8 rounded-full hover:bg-primary/20 hover:text-primary">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <span className="text-xs font-bold text-primary">{req.votes}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[req.status] || "bg-muted text-muted-foreground"}`}>
                      {req.status}
                    </span>
                  </div>
                </motion.div>
              )) : (
                <div className="text-muted-foreground text-center py-12 bg-card border border-white/10 rounded-xl">
                  <Wrench className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No mod requests yet. Submit the first one!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
