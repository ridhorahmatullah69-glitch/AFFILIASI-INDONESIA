import React, { useState, useEffect } from "react";
import { BookOpen, Search, Clock, Eye, SlidersHorizontal, ArrowRight, Sparkles } from "lucide-react";
import { BlogArticle } from "../types.js";

interface BlogViewProps {
  setRoute: (route: string) => void;
}

export default function BlogView({ setRoute }: BlogViewProps) {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const articleTypes = [
    { value: "all", label: "Semua Tulisan" },
    { value: "Review Produk", label: "Review Produk" },
    { value: "Perbandingan Produk", label: "Perbandingan" },
    { value: "Buying Guide", label: "Buying Guide" },
    { value: "Tutorial", label: "Tutorial & Tips" },
    { value: "Promo", label: "Promo & Flash Sale" }
  ];

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeType !== "all") params.append("type", activeType);
      if (query.trim()) params.append("query", query.trim());

      const res = await fetch(`/api/articles?${params.toString()}`);
      if (res.ok) {
        setArticles(await res.json());
      }
    } catch (e) {
      console.error("Fetch blog articles error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [activeType, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans" id="blog-cms-view">
      
      {/* Blog Hero Banner */}
      <div className="relative overflow-hidden bg-gray-950 rounded-3xl p-8 sm:p-12 text-white mb-10">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl"></div>
        <div className="max-w-xl space-y-4">
          <div className="inline-flex items-center space-x-1 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Pusat Edukasi Belanja</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Blog Ulasan & Buying Guides Terpercaya</h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Temukan rahasia membeli gawai premium, sepatu olahraga lokal tangguh, serta peralatan rumah pintar dengan promo maksimal. Ditulis oleh jurnalis teknologi berpengalaman dan disupervisi oleh AI.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs">
        <div className="flex flex-wrap gap-1.5">
          {articleTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveType(type.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeType === type.value
                  ? "bg-gray-950 text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Cari artikel ulasan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-rose-400"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Articles Grid list */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
              <div className="aspect-video bg-gray-100 rounded-xl"></div>
              <div className="h-4 bg-gray-150 rounded w-1/2"></div>
              <div className="h-3.5 bg-gray-150 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <article 
              key={art.id} 
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-lg hover:border-gray-200 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-gray-50 border-b border-gray-50">
                  <img src={art.featuredImage} alt={art.title} className="h-full w-full object-cover group-hover:scale-102 transition duration-500" />
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-gray-900/85 backdrop-blur-sm text-white text-[9px] font-bold rounded-lg uppercase">
                    {art.type}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400 mb-2 font-mono">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {art.publishDate}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {art.views} Dilihat</span>
                  </div>

                  <h3 
                    onClick={() => setRoute(`#/blog/${art.slug}`)}
                    className="text-xs sm:text-sm font-extrabold text-gray-900 hover:text-rose-500 transition cursor-pointer line-clamp-2 min-h-[40px] leading-tight"
                  >
                    {art.title}
                  </h3>

                  {art.metaDescription && (
                    <p className="text-[11px] text-gray-400 mt-2 line-clamp-2 leading-relaxed">{art.metaDescription}</p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {art.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-50 rounded-lg text-[9px] font-semibold text-gray-500 border border-gray-150">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-50 px-5 py-3.5 flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Oleh {art.author}</span>
                <button 
                  onClick={() => setRoute(`#/blog/${art.slug}`)}
                  className="text-rose-500 font-extrabold hover:text-rose-600 flex items-center space-x-1"
                >
                  <span>Baca</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-sm font-bold text-gray-900">Belum Ada Artikel</h3>
          <p className="text-xs text-gray-400 mt-1">Kami belum mempublikasikan ulasan untuk kriteria tersebut. Segera kembali!</p>
        </div>
      )}
    </div>
  );
}
