"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TruckIcon, InfoIcon, CheckIcon } from "@/lib/icons";

export default function DeliveryInstructionsPage() {
  const [instructions, setInstructions] = useState("");
  const [defaultLabel, setDefaultLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchInstructions = useCallback(async () => {
    try {
      const res = await fetch("/api/account/delivery-instructions");
      const data = await res.json();
      setInstructions(data.default || "");
      setDefaultLabel(data.defaultLabel);
    } catch {
      toast.error("Failed to load delivery instructions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInstructions();
  }, [fetchInstructions]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/account/delivery-instructions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Delivery instructions saved");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-6 lg:py-0">
      <div className="lg:hidden mb-6">
        <h1 className="text-2xl font-bold text-foreground">delivery instructions</h1>
        <p className="text-sm text-muted-foreground mt-1">set default delivery notes</p>
      </div>

      <div className="hidden lg:block mb-6">
        <h2 className="text-lg font-bold text-foreground">delivery instructions</h2>
        <p className="text-sm text-muted-foreground mt-1">add notes for your delivery partner</p>
      </div>

      {/* Info box */}
      <div className="rounded-2xl border border-[#CCFF00]/30 bg-[#CCFF00]/5 p-4 mb-6 flex gap-3">
        <InfoIcon size={18} className="text-[#CCFF00] shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-foreground font-medium">how it works</p>
          <p className="text-muted-foreground mt-1">
            These instructions will be applied to your default address{" "}
            {defaultLabel && <span className="font-medium text-foreground">({defaultLabel})</span>}. You can also set specific instructions per address in the addresses section.
          </p>
        </div>
      </div>

      <div className="max-w-lg space-y-4">
        <div className="space-y-2">
          <Label htmlFor="instructions" className="text-xs text-muted-foreground">
            default delivery instructions
          </Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Leave at the security gate, ring the bell twice, call on arrival..."
            className="rounded-xl min-h-[120px]"
          />
          <p className="text-[11px] text-muted-foreground/60">
            {instructions.length}/300 characters
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving || instructions.length > 300}
          className="rounded-full h-10 px-6 text-sm font-semibold gap-1.5"
        >
          <CheckIcon size={14} />
          {saving ? "saving..." : "save instructions"}
        </Button>
      </div>
    </div>
  );
}
