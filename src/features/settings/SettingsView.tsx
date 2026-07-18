"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Globe,
  Monitor,
  Moon,
  Palette,
  Play,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/Avatar";
import { Button } from "@/components/shared/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shared/Select";
import { SettingsRow, SettingsSection } from "@/components/shared/SettingsRow";
import { Switch } from "@/components/shared/Switch";
import { currentUser } from "@/data/users";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "account", label: "Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "playback", label: "Playback", icon: Play },
] as const;

type SectionId = (typeof NAV_ITEMS)[number]["id"];

export function SettingsView() {
  const [activeSection, setActiveSection] = useState<SectionId>("account");
  const { theme, setTheme } = useTheme();

  // Notification toggles
  const [notifToggles, setNotifToggles] = useState({
    uploads: true,
    comments: true,
    replies: true,
    likes: false,
    subscriptions: true,
    email: false,
  });

  // Privacy toggles
  const [privacyToggles, setPrivacyToggles] = useState({
    privateHistory: false,
    privateLikes: true,
    privateSubs: false,
    dataCollection: true,
  });

  // Playback toggles
  const [playbackToggles, setPlaybackToggles] = useState({
    autoplay: true,
    annotations: false,
    captions: false,
  });

  const [quality, setQuality] = useState("auto");
  const [speed, setSpeed] = useState("1");
  const [language, setLanguage] = useState("en");

  const toggleNotif = (key: keyof typeof notifToggles) =>
    setNotifToggles((p) => ({ ...p, [key]: !p[key] }));
  const togglePrivacy = (key: keyof typeof privacyToggles) =>
    setPrivacyToggles((p) => ({ ...p, [key]: !p[key] }));
  const togglePlayback = (key: keyof typeof playbackToggles) =>
    setPlaybackToggles((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar nav */}
        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible md:w-52 shrink-0 pb-1 md:pb-0">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                activeSection === id
                  ? "bg-surface-secondary text-text"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  activeSection === id && "text-primary",
                )}
              />
              {label}
            </button>
          ))}
        </nav>

        {/* Section content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* ── Account ── */}
              {activeSection === "account" && (
                <>
                  <SettingsSection title="Profile">
                    <div className="py-5 flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={currentUser.avatar}
                          alt={currentUser.name}
                        />
                        <AvatarFallback className="text-xl">Y</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-text">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {currentUser.handle}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-fit"
                        >
                          Change photo
                        </Button>
                      </div>
                    </div>
                    <SettingsRow label="Display name">
                      <input
                        defaultValue={currentUser.name}
                        className="h-9 w-48 rounded-lg border border-border bg-surface-secondary px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </SettingsRow>
                    <SettingsRow label="Handle">
                      <input
                        defaultValue={currentUser.handle}
                        className="h-9 w-48 rounded-lg border border-border bg-surface-secondary px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </SettingsRow>
                  </SettingsSection>

                  <SettingsSection
                    title="Account"
                    description="Manage your account details"
                  >
                    <SettingsRow label="Email address">
                      <span className="text-sm text-text-secondary">
                        you@example.com
                      </span>
                    </SettingsRow>
                    <SettingsRow label="Password">
                      <Button variant="outline" size="sm">
                        Change password
                      </Button>
                    </SettingsRow>
                    <SettingsRow
                      label="Language"
                      description="Choose your preferred language"
                    >
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingsRow>
                  </SettingsSection>

                  <SettingsSection title="Danger zone">
                    <SettingsRow
                      label="Delete account"
                      description="Permanently delete your account and all data"
                    >
                      <Button variant="destructive" size="sm">
                        Delete account
                      </Button>
                    </SettingsRow>
                  </SettingsSection>
                </>
              )}

              {/* ── Appearance ── */}
              {activeSection === "appearance" && (
                <SettingsSection
                  title="Appearance"
                  description="Customize how YPlay looks"
                >
                  <SettingsRow
                    label="Theme"
                    description="Choose between light, dark, or system theme"
                  >
                    <div className="flex items-center gap-1.5 rounded-lg border border-border p-1">
                      {(["light", "system", "dark"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                            theme === t
                              ? "bg-surface-secondary text-text"
                              : "text-text-secondary hover:text-text",
                          )}
                        >
                          {t === "light" && <Sun className="h-3.5 w-3.5" />}
                          {t === "dark" && <Moon className="h-3.5 w-3.5" />}
                          {t === "system" && (
                            <Monitor className="h-3.5 w-3.5" />
                          )}
                          {t}
                        </button>
                      ))}
                    </div>
                  </SettingsRow>
                  <SettingsRow
                    label="Compact mode"
                    description="Show more content with reduced spacing"
                  >
                    <Switch />
                  </SettingsRow>
                  <SettingsRow
                    label="Reduce motion"
                    description="Minimize animations throughout the app"
                  >
                    <Switch />
                  </SettingsRow>
                </SettingsSection>
              )}

              {/* ── Notifications ── */}
              {activeSection === "notifications" && (
                <>
                  <SettingsSection
                    title="Push notifications"
                    description="Control what you get notified about"
                  >
                    <SettingsRow
                      label="New uploads"
                      description="When channels you follow upload a video"
                    >
                      <Switch
                        checked={notifToggles.uploads}
                        onCheckedChange={() => toggleNotif("uploads")}
                      />
                    </SettingsRow>
                    <SettingsRow
                      label="Comments"
                      description="When someone comments on your videos"
                    >
                      <Switch
                        checked={notifToggles.comments}
                        onCheckedChange={() => toggleNotif("comments")}
                      />
                    </SettingsRow>
                    <SettingsRow
                      label="Replies"
                      description="When someone replies to your comments"
                    >
                      <Switch
                        checked={notifToggles.replies}
                        onCheckedChange={() => toggleNotif("replies")}
                      />
                    </SettingsRow>
                    <SettingsRow
                      label="Likes"
                      description="When someone likes your video or comment"
                    >
                      <Switch
                        checked={notifToggles.likes}
                        onCheckedChange={() => toggleNotif("likes")}
                      />
                    </SettingsRow>
                    <SettingsRow
                      label="New subscribers"
                      description="When someone subscribes to your channel"
                    >
                      <Switch
                        checked={notifToggles.subscriptions}
                        onCheckedChange={() => toggleNotif("subscriptions")}
                      />
                    </SettingsRow>
                  </SettingsSection>
                  <SettingsSection title="Email notifications">
                    <SettingsRow
                      label="Email digest"
                      description="Receive a weekly summary via email"
                    >
                      <Switch
                        checked={notifToggles.email}
                        onCheckedChange={() => toggleNotif("email")}
                      />
                    </SettingsRow>
                  </SettingsSection>
                </>
              )}

              {/* ── Privacy ── */}
              {activeSection === "privacy" && (
                <>
                  <SettingsSection
                    title="Privacy"
                    description="Control your visibility and data"
                  >
                    <SettingsRow
                      label="Private watch history"
                      description="Don't use your history to personalize recommendations"
                    >
                      <Switch
                        checked={privacyToggles.privateHistory}
                        onCheckedChange={() => togglePrivacy("privateHistory")}
                      />
                    </SettingsRow>
                    <SettingsRow
                      label="Private liked videos"
                      description="Hide your liked videos from your public profile"
                    >
                      <Switch
                        checked={privacyToggles.privateLikes}
                        onCheckedChange={() => togglePrivacy("privateLikes")}
                      />
                    </SettingsRow>
                    <SettingsRow
                      label="Private subscriptions"
                      description="Hide your subscriptions from your public profile"
                    >
                      <Switch
                        checked={privacyToggles.privateSubs}
                        onCheckedChange={() => togglePrivacy("privateSubs")}
                      />
                    </SettingsRow>
                  </SettingsSection>
                  <SettingsSection title="Data">
                    <SettingsRow
                      label="Personalised ads"
                      description="Allow YPlay to use your data for ad personalization"
                    >
                      <Switch
                        checked={privacyToggles.dataCollection}
                        onCheckedChange={() => togglePrivacy("dataCollection")}
                      />
                    </SettingsRow>
                    <SettingsRow
                      label="Download your data"
                      description="Export a copy of all your YPlay data"
                    >
                      <Button variant="outline" size="sm">
                        <Globe className="h-3.5 w-3.5" />
                        Request export
                      </Button>
                    </SettingsRow>
                  </SettingsSection>
                </>
              )}

              {/* ── Playback ── */}
              {activeSection === "playback" && (
                <SettingsSection
                  title="Playback"
                  description="Control how videos play"
                >
                  <SettingsRow
                    label="Autoplay"
                    description="Automatically play the next video"
                  >
                    <Switch
                      checked={playbackToggles.autoplay}
                      onCheckedChange={() => togglePlayback("autoplay")}
                    />
                  </SettingsRow>
                  <SettingsRow
                    label="Default quality"
                    description="Choose your preferred video quality"
                  >
                    <Select value={quality} onValueChange={setQuality}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="1080">1080p</SelectItem>
                        <SelectItem value="720">720p</SelectItem>
                        <SelectItem value="480">480p</SelectItem>
                        <SelectItem value="360">360p</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsRow>
                  <SettingsRow
                    label="Playback speed"
                    description="Set your default playback speed"
                  >
                    <Select value={speed} onValueChange={setSpeed}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5×</SelectItem>
                        <SelectItem value="0.75">0.75×</SelectItem>
                        <SelectItem value="1">1× (Normal)</SelectItem>
                        <SelectItem value="1.25">1.25×</SelectItem>
                        <SelectItem value="1.5">1.5×</SelectItem>
                        <SelectItem value="2">2×</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingsRow>
                  <SettingsRow
                    label="Captions"
                    description="Show captions by default when available"
                  >
                    <Switch
                      checked={playbackToggles.captions}
                      onCheckedChange={() => togglePlayback("captions")}
                    />
                  </SettingsRow>
                  <SettingsRow
                    label="Video annotations"
                    description="Show interactive annotations on videos"
                  >
                    <Switch
                      checked={playbackToggles.annotations}
                      onCheckedChange={() => togglePlayback("annotations")}
                    />
                  </SettingsRow>
                </SettingsSection>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
