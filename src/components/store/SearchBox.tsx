"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Image from "next/image";

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  salePrice: number | null;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + "đ";
}

export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((data: SearchResult[]) => {
        setResults(data);
        setOpen(true);
        setActiveIndex(-1);
      })
      .catch(() => {/* aborted */})
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Close on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      router.push(`/san-pham/${results[activeIndex].slug}`);
      setOpen(false);
      setQuery("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    if (activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      router.push(`/san-pham/${results[activeIndex].slug}`);
      setOpen(false);
      setQuery("");
    }
    // else: let the native form GET /san-pham?q=... happen
  }

  function handleSelect(slug: string) {
    router.push(`/san-pham/${slug}`);
    setOpen(false);
    setQuery("");
  }

  const showDropdown = open && query.length >= 2;

  return (
    <div className="rethink-header__search" ref={containerRef}>
      <form action="/san-pham" method="GET" onSubmit={handleSubmit}>
        <input
          name="q"
          type="search"
          placeholder="Tìm phân bón, thuốc BVTV, hạt giống..."
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" aria-label="Tìm kiếm">
          <Search size={18} />
        </button>
      </form>

      {showDropdown && (
        <div className="rethink-search-dropdown">
          {loading && (
            <div className="rethink-search-dropdown__status">Đang tìm...</div>
          )}

          {!loading && results.length === 0 && (
            <div className="rethink-search-dropdown__status">
              Không tìm thấy sản phẩm nào
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="rethink-search-dropdown__list">
              {results.map((r, i) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className={`rethink-search-dropdown__item${
                      i === activeIndex ? " rethink-search-dropdown__item--active" : ""
                    }`}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => handleSelect(r.slug)}
                  >
                    {r.image ? (
                      <Image
                        src={r.image}
                        alt={r.name}
                        className="rethink-search-dropdown__img"
                        width={44}
                        height={44}
                      />
                    ) : (
                      <div className="rethink-search-dropdown__img rethink-search-dropdown__img--placeholder" />
                    )}
                    <div className="rethink-search-dropdown__info">
                      <span className="rethink-search-dropdown__name">{r.name}</span>
                      <span className="rethink-search-dropdown__price">
                        {r.salePrice ? (
                          <>
                            <span className="rethink-search-dropdown__sale">{fmt(r.salePrice)}</span>
                            <span className="rethink-search-dropdown__orig">{fmt(r.price)}</span>
                          </>
                        ) : (
                          fmt(r.price)
                        )}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!loading && results.length > 0 && (
            <a
              href={`/san-pham?q=${encodeURIComponent(query)}`}
              className="rethink-search-dropdown__view-all"
            >
              Xem tất cả kết quả cho &ldquo;{query}&rdquo;
            </a>
          )}
        </div>
      )}
    </div>
  );
}
