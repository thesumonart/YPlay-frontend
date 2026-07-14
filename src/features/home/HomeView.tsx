"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FeaturedVideo } from "@/components/video/FeaturedVideo";
import { VideoCard } from "@/components/video/VideoCard";
import { CategoryChips } from "@/components/video/CategoryChips";
import { mockVideos, featuredVideos } from "@/data/videos";
import { mockCategories } from "@/data/categories";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function HomeView() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = useMemo(() => {
    const regular = mockVideos.filter((v) => !v.isShort);
    if (selectedCategory === "all") return regular;
    return regular.filter((v) => v.category === selectedCategory);
  }, [selectedCategory]);

  const featured = featuredVideos[0];

  return (
    <div className="flex flex-col gap-8">
      {/* Featured */}
      {featured && selectedCategory === "all" && (
        <FeaturedVideo video={featured} />
      )}

      {/* Category filter */}
      <CategoryChips
        categories={mockCategories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Video grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-[var(--text-secondary)]">
          <p className="text-lg font-medium">No videos in this category yet</p>
          <p className="text-sm mt-1">Try selecting a different category</p>
        </div>
      ) : (
        <motion.div
          key={selectedCategory}
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8"
        >
          {filtered.map((video) => (
            <motion.div key={video.id} variants={fadeUp}>
              <VideoCard video={video} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
