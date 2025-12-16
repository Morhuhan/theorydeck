// components/theory/TheoryList.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { TheoryCard } from "./TheoryCard";
import { Hero } from "@/components/home/Hero";
import { Loader2 } from "lucide-react";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";

interface Theory {
  id: string;
  slug: string;
  title: string;
  claim: string;
  tldr: string;
  realm?: string | null;
  topic?: string | null;
  tags: string[];
  status: string;
  createdAt: string;
  author: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  _count: {
    evidenceCards: number;
  };
  voteStats?: {
    forPercent: number;
  };
}

const THEORIES_PER_PAGE = 12;

export function TheoryList() {
  const [theories, setTheories] = useState<Theory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadTheories = useCallback(async (pageNum: number, search: string, append = false) => {
    try {
      if (!append) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: THEORIES_PER_PAGE.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/theories?${params}`);

      if (!response.ok) {
        throw new Error("Ошибка при загрузке теорий");
      }

      const data = await response.json();
      
      if (append) {
        setTheories(prev => [...prev, ...data.theories]);
      } else {
        setTheories(data.theories);
      }
      
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    loadTheories(0, debouncedSearch, false);
  }, [debouncedSearch, loadTheories]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadTheories(nextPage, debouncedSearch, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, isLoadingMore, page, debouncedSearch, loadTheories]);

  return (
    <div className="min-h-screen bg-[#f5f6f8] dark:bg-gray-900">
      <Hero onSearch={setSearchQuery} searchQuery={searchQuery} />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading && theories.length === 0 ? (
          <div className="text-center py-20">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-[#0079bf]" />
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">Загрузка теорий...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        ) : theories.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              {searchQuery 
                ? `Теорий по запросу "${searchQuery}" не найдено`
                : "Пока нет теорий. Создайте первую!"
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {theories.map((theory) => (
                <TheoryCard
                  key={theory.id}
                  id={theory.id}
                  slug={theory.slug}
                  title={theory.title}
                  claim={theory.claim}
                  tldr={theory.tldr}
                  realm={theory.realm || undefined}
                  topic={theory.topic || undefined}
                  tags={theory.tags}
                  status={theory.status as any}
                  createdAt={new Date(theory.createdAt)}
                  authorName={theory.author.name || theory.author.email || "Аноним"}
                  evidenceCount={theory._count.evidenceCards}
                  forPercent={theory.voteStats?.forPercent ?? undefined}
                />
              ))}
            </div>

            <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
              {isLoadingMore && (
                <Loader2 className="h-6 w-6 animate-spin text-[#0079bf]" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}