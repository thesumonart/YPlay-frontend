"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  ImagePlus,
  Save,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { mockCategories } from "@/data/categories";
import { cn, formatDuration, formatViews, timeAgo } from "@/lib/utils";
import type { Video } from "@/types";

const VISIBILITIES = ["Public", "Unlisted", "Private"] as const;
type Visibility = (typeof VISIBILITIES)[number];

function visibilityFromVideo(v: Video): Visibility {
  return "Public";
}

interface StudioVideoEditViewProps {
  video: Video;
}

export function StudioVideoEditView({ video }: StudioVideoEditViewProps) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [tags, setTags] = useState(video.tags.join(", "));
  const [category, setCategory] = useState(video.category);
  const [visibility, setVisibility] = useState<Visibility>(
    visibilityFromVideo(video),
  );
  const [saved, setSaved] = useState(false);

  const categories = mockCategories.filter((c) => c.id !== "all");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/studio/content">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-bold text-text leading-tight line-clamp-1">
              {video.title}
            </h1>
            <p className="text-xs text-text-secondary">
              {formatViews(video.views)} views · {timeAgo(video.publishedAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/watch/${video.id}`} target="_blank">
              <Eye className="h-3.5 w-3.5" />
              View
            </Link>
          </Button>
          <Button size="sm" onClick={handleSave} className="gap-1.5">
            {saved ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: form */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">
              Title <span className="text-danger">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className={inputClass}
            />
            <p className="text-right text-xs text-text-secondary">
              {title.length}/100
            </p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              rows={6}
              className={cn(inputClass, "resize-none")}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">
              Tags
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Separate tags with commas"
              className={inputClass}
            />
            {/* Tag pills preview */}
            {tags.trim() && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-surface-secondary border border-border px-2.5 py-0.5 text-xs text-text-secondary"
                    >
                      #{t}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Category + Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as Visibility)}
                className={inputClass}
              >
                {VISIBILITIES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text">
              Thumbnail
            </label>
            <div className="flex gap-4 items-start">
              <div className="relative w-40 aspect-video rounded-xl overflow-hidden bg-surface-secondary shrink-0">
                <Image
                  src={video.thumbnail}
                  alt="Current thumbnail"
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-text-secondary">
                  Current thumbnail
                </p>
                <button className="flex items-center gap-2 rounded-lg border border-dashed border-border px-4 py-2.5 text-sm text-text-secondary hover:border-primary/50 hover:text-text transition-colors">
                  <ImagePlus className="h-4 w-4" />
                  Upload new
                </button>
                <p className="text-xs text-text-secondary">
                  1280×720 recommended
                </p>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-text">
                Delete video
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>

        {/* Right: live preview */}
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-text">Preview</p>

          {/* Thumbnail preview */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-secondary">
            <Image
              src={video.thumbnail}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
            <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
              {formatDuration(video.duration)}
            </span>
          </div>

          {/* Meta preview */}
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-text line-clamp-2 leading-snug">
              {title || "Video title"}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="relative h-5 w-5 rounded-full overflow-hidden bg-surface-secondary shrink-0">
                <Image
                  src={video.channel.avatar}
                  alt={video.channel.name}
                  fill
                  sizes="20px"
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                {video.channel.name}
                {video.channel.verified && <CheckCircle2 className="h-3 w-3" />}
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              {formatViews(video.views)} views · {timeAgo(video.publishedAt)}
            </p>
          </div>

          {/* Stats panel */}
          <div className="rounded-xl border border-border bg-surface-secondary divide-y divide-border">
            {[
              { label: "Views", value: formatViews(video.views) },
              { label: "Likes", value: formatViews(video.likes) },
              {
                label: "Comments",
                value: formatViews(Math.floor(video.likes * 0.04)),
              },
              { label: "Duration", value: formatDuration(video.duration) },
              { label: "Visibility", value: visibility },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-2.5"
              >
                <span className="text-xs text-text-secondary">
                  {label}
                </span>
                <span className="text-xs font-semibold text-text">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Save button (sticky on mobile) */}
          <motion.div
            animate={saved ? { scale: [1, 1.04, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Button
              className="w-full gap-2"
              onClick={handleSave}
              disabled={!title.trim()}
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save changes
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
