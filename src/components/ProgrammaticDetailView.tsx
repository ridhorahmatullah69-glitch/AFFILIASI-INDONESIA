import React, { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, AlertCircle, ShoppingCart, HelpCircle, FileText, ChevronRight, Star } from "lucide-react";
import { ProgrammaticPage, Product } from "../types.js";

interface ProgrammaticDetailProps {
  slug: string;
  setRoute: (route: string) => void;
}

export default function ProgrammaticDetailView({ slug, setRoute }: ProgrammaticDetailProps) {
  const [page, setPage] = useState<ProgrammaticPage | null>(null);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/programmatic-pages/${slug}`);
        if (res.ok) {
          const data: ProgrammaticPage = await res.json();
          setPage(data);

          // Fetch matched products under category
          const prodRes = await fetch(`/api/products?category=${data.category}`);
          if (prodRes.ok) {
            setMatchedProducts(await prodRes.json());
          }
        }
      } catch (e) {
        console.error("Fetch programmatic page details error", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPageDetails();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center animate-pulse space-y-4">
        <div className="h-6 bg-gray-150 rounded w-1/3 mx-auto"></div>
        <div className="h-40 bg-gray-100 rounded-2xl w-full max-w-4xl mx-auto"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Halaman Pencarian Tidak Ditemukan</h2>
        <p className="text-xs text-gray-400 mt-2">Halaman direktori yang Anda cari tidak dapat dijangkau.</p>
        <button onClick={() => setRoute("#/")} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold transition">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 font-sans" id="programmatic-seo-container">
      
      {/* Back Button */}
      <button 
        onClick={() => setRoute("#/")} 
        className="flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Beranda</span>
      </button>

      {/* Programmatic Title & Hero */}
      <header className="space-y-4 mb-8 p-6 sm:p-8 bg-gradient-to-tr from-gray-50 via-white to-rose-50/20 border border-gray-100 rounded-3xl">
        <div className="inline-flex items-center space-x-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-100">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Panduan Belanja AI-Optimized</span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">
          {page.title}
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
          {page.metaDescription}
        </p>
      </header>

      {/* Programmatic Main Body Article */}
      <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-2xs mb-8">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Ulasan Umum & Rekomendasi</h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">{page.content}</p>
      </section>

      {/* Matched Products list */}
      <section className="mb-10" id="seo-matched-products">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Daftar Rekomendasi Barang</h3>
        
        {matchedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {matchedProducts.map((p) => {
              const bestAff = p.affiliates.sort((a, b) => a.price - b.price)[0];
              return (
                <div key={p.id} className="bg-white border border-gray-150 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-center hover:shadow-lg transition">
                  <img src={p.images[0]} alt={p.name} className="h-24 w-24 object-cover rounded-xl border border-gray-100 shrink-0" />
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[9px] font-mono text-gray-400 uppercase">{p.brand}</span>
                    <h4 
                      onClick={() => setRoute(`#/product/${p.slug}`)}
                      className="text-xs font-bold text-gray-800 hover:text-rose-500 cursor-pointer transition line-clamp-1 mt-0.5"
                    >
                      {p.name}
                    </h4>
                    <div className="flex items-center justify-center sm:justify-start space-x-1 mt-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-gray-700">{p.rating}</span>
                    </div>
                    <div className="text-xs font-black text-rose-600 mt-2 font-mono">Rp {p.lowestPrice.toLocaleString('id-ID')}</div>
                  </div>
                  <button 
                    onClick={() => setRoute(`#/product/${p.slug}`)}
                    className="px-3.5 py-1.5 bg-gray-900 hover:bg-rose-500 text-white rounded-xl text-[10px] font-bold transition shrink-0"
                  >
                    Bandingkan
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-150 text-xs text-gray-400">
            Belum ada produk yang cocok untuk kategori & Merek ini.
          </div>
        )}
      </section>

      {/* Programmatic structured FAQ */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xs" id="seo-faq-sec">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-1">
            <HelpCircle className="h-4 w-4 text-rose-500" /> FAQ Terkait Pencarian Anda
          </h3>
          <div className="space-y-4">
            {page.faqs.map((f, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] font-bold text-rose-500">Q: {f.question}</span>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">A: {f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Search Engine meta debugger */}
      <div className="bg-gray-900 rounded-2xl p-4 text-white">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-gray-400 mb-2.5">
          <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-rose-400" /> Google Search Console & Meta Debugger</span>
          <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[8px] rounded">INDEXED</span>
        </div>
        <div className="space-y-1.5 text-[10px] font-mono text-gray-300">
          <div><span className="text-gray-500">Slug:</span> {page.slug}</div>
          <div><span className="text-gray-500">Target Keyword:</span> {page.keyword}</div>
          <div><span className="text-gray-500">Meta Title:</span> {page.title}</div>
          <div><span className="text-gray-500">Robots Directive:</span> index, follow, max-snippet:-1, max-image-preview:large</div>
        </div>
      </div>

    </div>
  );
}
