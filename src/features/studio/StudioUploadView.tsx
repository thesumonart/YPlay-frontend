"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Film, CheckCircle2, X, ImagePlus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/Button";
import { mockCategories } from "@/data/categories";

type Step = "drop" | "details" | "success";

const VISIBILITIES = ["Public", "Unlisted", "Private"] as const;

export function StudioUploadView() {
  const [step, setStep] = useState<Step>("drop");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("tech");
  const [visibility, setVisibility] = useState<(typeof VISIBILITIES)[number]>("Public");
  const [tags, setTags] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((name: string) => {
    setFileName(name);
    setTitle(name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    setStep("details");
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file.name);
    },
    [handleFile]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file.name);
  };

  const categories = mockCategories.filter((c) => c.id !== "all");

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {(["drop", "details", "success"] as Step[]).map((s, i) => {
          const labels = ["Upload", "Details", "Published"];
          const done =
            (step === "details" && i === 0) ||
            (step === "success" && i <= 1);
          const active = step === s;
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  active
                    ? "bg-[var(--primary)] text-white"
                    : done
                    ? "bg-[var(--success,#22c55e)] text-white"
                    : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                )}
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-medium",
                  active ? "text-[var(--text)]" : "text-[var(--text-secondary)]"
                )}
              >
                {labels[i]}
              </span>
              {i < 2 && <ChevronRight className="h-4 w-4 text-[var(--text-secondary)]" />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === "drop" && (
          <motion.div
            key="drop"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-5 rounded-2xl border-2 border-dashed py-24 cursor-pointer transition-colors",
                dragging
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--surface-secondary)]"
              )}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--surface-secondary)]">
                <Upload className={cn("h-9 w-9 transition-colors", dragging ? "text-[var(--primary)]" : "text-[var(--text-secondary)]")} />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-[var(--text)]">
                  {dragging ? "Drop to upload" : "Drag & drop your video here"}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  MP4, MOV, AVI, MKV up to 10 GB
                </p>
              </div>
              <Button size="lg" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                Select file
              </Button>
              <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={onFileChange} />
            </div>
          </motion.div>
        )}

        {step === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left: form */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* File badge */}
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3">
                <Film className="h-5 w-5 shrink-0 text-[var(--primary)]" />
                <span className="flex-1 truncate text-sm font-medium text-[var(--text)]">{fileName}</span>
                <button
                  onClick={() => setStep("drop")}
                  className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text)]">Title <span className="text-[var(--danger)]">*</span></label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  placeholder="Add a title that describes your video"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <p className="text-right text-xs text-[var(--text-secondary)]">{title.length}/100</p>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text)]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={5000}
                  rows={5}
                  placeholder="Tell viewers about your video"
                  className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text)]">Tags</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add tags separated by commas"
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              {/* Category + Visibility */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text)]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text)]">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as typeof visibility)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    {VISIBILITIES.map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep("drop")}>Back</Button>
                <Button disabled={!title.trim()} onClick={() => setStep("success")}>
                  Publish
                </Button>
              </div>
            </div>

            {/* Right: thumbnail placeholder */}
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-[var(--text)]">Thumbnail</p>
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-secondary)] cursor-pointer hover:border-[var(--primary)]/50 transition-colors">
                <ImagePlus className="h-8 w-8 text-[var(--text-secondary)]" />
                <p className="text-xs text-[var(--text-secondary)] text-center px-4">
                  Upload a custom thumbnail<br />1280×720 recommended
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Preview</p>
                <p className="text-sm font-semibold text-[var(--text)] line-clamp-2">{title || "Video title"}</p>
                <p className="text-xs text-[var(--text-secondary)]">Alex Rivera · {visibility}</p>
              </div>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-6 py-24 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--success,#22c55e)]/15"
            >
              <CheckCircle2 className="h-10 w-10 text-[var(--success,#22c55e)]" />
            </motion.div>
            <div>
              <p className="text-xl font-bold text-[var(--text)]">Video published!</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                &ldquo;{title}&rdquo; is now {visibility.toLowerCase()}.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setStep("drop"); setFileName(""); setTitle(""); setDescription(""); setTags(""); }}>
                Upload another
              </Button>
              <Button asChild>
                <a href="/studio/content">View in Content</a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
