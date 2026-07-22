"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserIcon, MailIcon, PhoneIcon, CalendarIcon, EditIcon, CheckIcon, CloseIcon } from "@/lib/icons";

type Profile = { id: string; name: string | null; email: string; phone: string | null; avatar: string | null; createdAt: string };

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/account/profile");
      const data = await res.json();
      if (data.id) {
        setProfile(data);
        setForm({ name: data.name || "", phone: data.phone || "" });
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.id) {
        setProfile(data);
        setEditing(false);
        toast.success("Profile updated");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
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

  const displayName = profile?.name || session?.user?.name || "User";

  return (
    <div className="px-4 sm:px-6 lg:px-0 py-6 lg:py-0">
      <div className="lg:hidden mb-6">
        <h1 className="text-2xl font-bold text-foreground">profile</h1>
        <p className="text-sm text-muted-foreground mt-1">manage your personal information</p>
      </div>

      {/* Mobile header - hidden on lg since sidebar has it */}

      <div className="max-w-lg">
        {/* Avatar & name */}
        <div className="flex items-center gap-4 mb-8">
          <div className="size-16 sm:size-20 rounded-full bg-muted flex items-center justify-center shrink-0">
            <span className="text-2xl sm:text-3xl font-bold text-muted-foreground">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{displayName}</h2>
            <p className="text-sm text-muted-foreground truncate">{profile?.email}</p>
            <p className="text-xs text-muted-foreground mt-1">
              member since {profile?.createdAt ? formatDate(profile.createdAt) : "—"}
            </p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* View mode */}
        {!editing ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">personal information</h3>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => setEditing(true)}>
                <EditIcon size={14} />
                edit
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <UserIcon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">full name</p>
                  <p className="text-sm text-foreground">{profile?.name || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MailIcon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">email address</p>
                  <p className="text-sm text-foreground">{profile?.email}</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5">email cannot be changed</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PhoneIcon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">phone number</p>
                  <p className="text-sm text-foreground">{profile?.phone || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CalendarIcon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">member since</p>
                  <p className="text-sm text-foreground">{profile?.createdAt ? formatDate(profile.createdAt) : "—"}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Edit mode */
          <div className="space-y-5">
            <h3 className="font-semibold text-foreground">edit profile</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs text-muted-foreground">full name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your name"
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-muted-foreground">email address</Label>
                <Input
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  className="rounded-xl h-11 bg-muted cursor-not-allowed"
                />
                <p className="text-[11px] text-muted-foreground/60">email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs text-muted-foreground">phone number</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full h-10 px-6 text-sm font-semibold gap-1.5"
              >
                <CheckIcon size={14} />
                {saving ? "saving..." : "save changes"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  setForm({ name: profile?.name || "", phone: profile?.phone || "" });
                }}
                className="rounded-full h-10 px-6 text-sm"
              >
                <CloseIcon size={14} />
                cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
