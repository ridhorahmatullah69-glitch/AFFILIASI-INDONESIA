import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Clock, 
  Eye, 
  Share2, 
  Sparkles, 
  BookOpen, 
  FileCode, 
  User, 
  Tag, 
  HelpCircle, 
  ChevronRight,
  Bookmark
} from "lucide-react";
import { BlogArticle } from "../types.js";

interface ArticleDetailProps {
  slug: string;
  setRoute: (route: string) => void;
}

export default function ArticleDetailView({ slug, setRoute }: ArticleDetailProps) {
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/articles/${slug}`);
        if (res.ok) {
          const data: BlogArticle = await res.json();
          setArticle(data);

          // Fetch related articles
          const relRes = await fetch("/api/articles");
          if (relRes.ok) {
            const relData: BlogArticle[] = await relRes.json();
            setRelatedArticles(relData.filter(a => a.id !== data.id).slice(0, 3));
          }
        }
      } catch (e) {
        console.error("Fetch article details error", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticleDetails();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center animate-pulse space-y-4">
        <div className="h-6 bg-gray-150 rounded w-1/3 mx-auto"></div>
        <div className="h-80 bg-gray-100 rounded-2xl w-full max-w-4xl mx-auto"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Artikel Tidak Ditemukan</h2>
        <p className="text-xs text-gray-400 mt-2">Artikel mungkin dipindah atau dihapus.</p>
        <button onClick={() => setRoute("#/blog")} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold transition">
          Kembali ke Blog
        </button>
      </div>
    );
  }

  // Simulated structured schema code output (JSON-LD block)
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": [article.featuredImage],
    "datePublished": article.publishDate,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "AFILIASI.ID",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ais-pre-xsdaw4jsq7i5f3pnzykiq7-688069481815.asia-southeast1.run.app/favicon.png"
      }
    },
    "description": article.metaDescription
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 font-sans" id="article-detail-container">
      
      {/* Navigation and Actions Row */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={() => setRoute("#/blog")} 
          className="flex items-center space-x-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Blog</span>
        </button>
        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Tautan artikel telah disalin!");
          }}
          className="p-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-gray-500 hover:text-gray-900 transition"
          title="Bagikan Artikel"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Article Header block */}
      <header className="space-y-4 mb-8">
        <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
          {article.type}
        </span>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-b border-gray-100 pb-5">
          <div className="flex items-center space-x-1">
            <User className="h-3.5 w-3.5 text-gray-400" />
            <span className="font-semibold text-gray-600">{article.author}</span>
          </div>
          <span>&bull;</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span>{article.publishDate}</span>
          </div>
          <span>&bull;</span>
          <div className="flex items-center space-x-1">
            <Eye className="h-3.5 w-3.5 text-gray-400" />
            <span>{article.views} Dilihat</span>
          </div>
        </div>
      </header>

      {/* Featured Banner Image */}
      <div className="aspect-video rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 mb-8">
        <img src={article.featuredImage} alt={article.title} className="h-full w-full object-cover" />
      </div>

      {/* Main HTML Content */}
      <div 
        className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-600 leading-relaxed font-sans space-y-4 mb-10"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tag Cloud */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-b border-gray-50 py-4 mb-10">
          <span className="text-xs font-bold text-gray-400 flex items-center gap-1 shrink-0"><Tag className="h-3.5 w-3.5" /> Tags:</span>
          {article.tags.map((tag, i) => (
            <span key={i} className="px-2.5 py-1 bg-gray-50 rounded-xl text-[11px] font-semibold text-gray-500 border border-gray-150">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Schema FAQ Accordion Widget */}
      {article.faqs && article.faqs.length > 0 && (
        <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xs" id="blog-faq-sec">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-1">
            <HelpCircle className="h-4 w-4 text-rose-500" /> FAQ Terkait Topik Ini
          </h3>
          <div className="space-y-4">
            {article.faqs.map((f, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] font-bold text-rose-500">Q: {f.question}</span>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">A: {f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Schema JSON-LD Drawer */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-150 mb-10">
        <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase mb-2">
          <span className="flex items-center gap-1"><FileCode className="h-3.5 w-3.5 text-emerald-500" /> SEO JSON-LD Schema (Structured Data)</span>
          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[8px]">ACTIVE</span>
        </div>
        <pre className="text-[9px] font-mono text-gray-500 p-3 bg-white rounded-lg border border-gray-100 overflow-x-auto max-h-36">
          {JSON.stringify(jsonLdSchema, null, 2)}
        </pre>
      </div>

      {/* Related articles slider */}
      {relatedArticles.length > 0 && (
        <section className="border-t border-gray-100 pt-8" id="related-articles-sec">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Artikel Panduan Terkait</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedArticles.map((art) => (
              <div key={art.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition">
                <img src={art.featuredImage} alt={art.title} className="h-24 w-full object-cover" />
                <div className="p-3">
                  <span className="text-[9px] text-rose-500 font-mono font-bold uppercase">{art.type}</span>
                  <h4 
                    onClick={() => setRoute(`#/blog/${art.slug}`)}
                    className="text-xs font-bold text-gray-800 hover:text-rose-500 cursor-pointer line-clamp-2 mt-0.5"
                  >
                    {art.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
