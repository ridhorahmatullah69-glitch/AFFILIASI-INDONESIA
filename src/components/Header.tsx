import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Menu, 
  X, 
  Heart, 
  GitCompare, 
  Settings, 
  BookOpen, 
  Home, 
  Bell, 
  Sparkles,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Product } from "../types.js";

interface HeaderProps {
  currentRoute: string;
  setRoute: (route: string) => void;
  wishlistCount: number;
  compareCount: number;
}

export default function Header({ currentRoute, setRoute, wishlistCount, compareCount }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] = useState([
    "ROG Zephyrus", "Galaxy S24 Ultra", "Sepatu Specs", "Printer Canon", "Tas Eiger"
  ]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setAutocompleteResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?query=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setAutocompleteResults(data.slice(0, 5));
        }
      } catch (e) {
        console.error("Autocomplete fetch error", e);
      }
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Handle outside click to close search autocomplete
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Save to recent searches
    const updated = [searchQuery.trim(), ...recentSearches.filter(s => s !== searchQuery.trim())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Post to backend analytics
    fetch("/api/analytics/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: searchQuery.trim() })
    }).catch(err => console.error(err));

    setIsSearchFocused(false);
    setRoute(`#/search?query=${encodeURIComponent(searchQuery.trim())}`);
  };

  const selectSuggestion = (queryStr: string) => {
    setSearchQuery(queryStr);
    const updated = [queryStr, ...recentSearches.filter(s => s !== queryStr)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    fetch("/api/analytics/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryStr })
    }).catch(err => console.error(err));

    setIsSearchFocused(false);
    setRoute(`#/search?query=${encodeURIComponent(queryStr)}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const navItems = [
    { name: "Beranda", icon: Home, hash: "#/" },
    { name: "Cari Produk", icon: Search, hash: "#/search" },
    { name: "Artikel & Review", icon: BookOpen, hash: "#/blog" },
    { name: "Bandingkan", icon: GitCompare, hash: "#/compare", count: compareCount },
    { name: "Wishlist", icon: Heart, hash: "#/wishlist", count: wishlistCount },
    { name: "Admin Panel", icon: Settings, hash: "#/admin" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div 
          onClick={() => setRoute("#/")} 
          className="flex cursor-pointer items-center space-x-2 transition hover:opacity-90"
          id="header-logo"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 text-white font-bold text-lg shadow-sm">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-base font-bold tracking-tight text-gray-900 leading-tight">
              AFILIASI<span className="text-rose-500 font-extrabold font-mono">.ID</span>
            </span>
            <span className="font-mono text-[9px] font-semibold text-gray-400 tracking-wider uppercase leading-none">
              Portal Cerdas Belanja
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const isActive = currentRoute === item.hash || currentRoute.startsWith(item.hash + "?") || (item.hash === "#/" && currentRoute === "");
            return (
              <button
                key={item.name}
                onClick={() => setRoute(item.hash)}
                id={`nav-item-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive 
                    ? "bg-gray-900 text-white shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
                }`}
              >
                <item.icon className={`h-3.5 w-3.5 ${isActive ? "text-rose-400" : "text-gray-400"}`} />
                <span>{item.name}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-xs">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Floating Suggestion Search Bar */}
        <div ref={searchRef} className="relative hidden sm:block w-64 md:w-72 lg:w-96">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Cari laptop, HP, sepatu lari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-400 focus:bg-white transition-all shadow-2xs"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery("")} 
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-xs"
              >
                Clear
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchFocused && (
            <div className="absolute right-0 mt-2 w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
              {searchQuery.trim().length >= 2 ? (
                <div>
                  <h4 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-rose-500" /> Hasil Rekomendasi
                  </h4>
                  {autocompleteResults.length > 0 ? (
                    <div className="space-y-1">
                      {autocompleteResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            setRoute(`#/product/${product.slug}`);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition"
                        >
                          <div className="flex items-center space-x-2.5">
                            <img src={product.images[0]} alt={product.name} className="h-7 w-7 rounded-md object-cover border border-gray-100" />
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-gray-800 line-clamp-1">{product.name}</span>
                              <span className="text-[9px] font-mono text-rose-500 font-bold">Mulai Rp {product.lowestPrice.toLocaleString('id-ID')}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-3 w-3 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">Tidak ada produk yang cocok</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Pencarian Terakhir
                        </h4>
                        <button onClick={clearRecentSearches} className="text-[10px] text-gray-400 hover:text-rose-500 transition">Hapus</button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((term, i) => (
                          <button
                            key={i}
                            onClick={() => selectSuggestion(term)}
                            className="px-2.5 py-1 text-[11px] font-medium bg-gray-50 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-gray-600 transition"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <h4 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-orange-500" /> Sedang Populer
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {popularSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => selectSuggestion(term)}
                          className="px-2.5 py-1 text-[11px] font-medium bg-gray-50 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-gray-600 transition"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Compare Badge for Mobile */}
          {compareCount > 0 && (
            <button 
              onClick={() => setRoute("#/compare")}
              className="relative p-1.5 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              <GitCompare className="h-4.5 w-4.5 text-rose-500" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
                {compareCount}
              </span>
            </button>
          )}
          {/* Wishlist Badge for Mobile */}
          {wishlistCount > 0 && (
            <button 
              onClick={() => setRoute("#/wishlist")}
              className="relative p-1.5 text-gray-600 hover:text-gray-900 rounded-lg"
            >
              <Heart className="h-4.5 w-4.5 text-rose-500 fill-rose-500" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">
                {wishlistCount}
              </span>
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded-lg focus:outline-none focus:bg-gray-50"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 py-3 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Cari laptop, HP, sepatu lari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-xl border border-gray-200 bg-gray-50 text-xs"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentRoute === item.hash || currentRoute.startsWith(item.hash + "?") || (item.hash === "#/" && currentRoute === "");
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setRoute(item.hash);
                  }}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive 
                      ? "bg-gray-950 text-white" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-4 w-4 text-rose-400" />
                  <span>{item.name}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
