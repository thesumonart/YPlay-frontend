import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchView } from "@/features/search/SearchView";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" – Search` : "Search",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <Suspense>
      <SearchView initialQuery={q ?? ""} />
    </Suspense>
  );
}
