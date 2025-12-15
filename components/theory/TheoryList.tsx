// components/theory/TheoryList.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { TheoryCard } from "./TheoryCard";
import { Hero } from "@/components/home/Hero";
import { Separator } from "@/components/ui/separator";
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
    <>
      <Hero onSearch={setSearchQuery} searchQuery={searchQuery} />
      <Separator className="my-8" />

      {isLoading && theories.length === 0 ? (
        <div className="mb-8 text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-4">Загрузка теорий...</p>
        </div>
      ) : error ? (
        <div className="mb-8 text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : theories.length === 0 ? (
        <div className="mb-8 text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery 
              ? `Теорий по запросу "${searchQuery}" не найдено`
              : "Пока нет теорий. Создайте первую!"
            }
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr max-w-8xl mx-auto">
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
                forPercent={50}
              />
            ))}
          </div>

          <div ref={observerTarget} className="h-20 flex items-center justify-center">
            {isLoadingMore && (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            )}
          </div>
        </>
      )}
    </>
  );
}