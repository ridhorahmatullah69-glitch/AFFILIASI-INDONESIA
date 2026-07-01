import React, { useState, useEffect } from "react";
import { 
  Shield, 
  UploadCloud, 
  RefreshCw, 
  PenTool, 
  Database, 
  Terminal, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Search, 
  ArrowRight,
  ExternalLink,
  Plus
} from "lucide-react";
import { BlogArticle, ProgrammaticPage, ClickAnalytic, SearchAnalytic, CronLog } from "../types.js";

export default function AdminPanel({ setRoute }: { setRoute: (route: string) => void }) {
  const [activeTab, setActiveTab] = useState("importer");
  
  // Importer State
  const [importType, setImportType] = useState("json");
  const [importContent, setImportContent] = useState("");
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Cron State
  const [cronLogs, setCronLogs] = useState<CronLog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // AI Article State
  const [articleKeyword, setArticleKeyword] = useState("");
  const [articleType, setArticleType] = useState("Review Produk");
  const [isGeneratingArticle, setIsGeneratingArticle] = useState(false);
  const [aiArticleResult, setAiArticleResult] = useState<BlogArticle | null>(null);

  // AI Programmatic State
  const [seoKeyword, setSeoKeyword] = useState("");
  const [seoCategory, setSeoCategory] = useState("gadget-handphone");
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [aiSeoResult, setAiSeoResult] = useState<ProgrammaticPage | null>(null);

  // Analytics States
  const [clicks, setClicks] = useState<ClickAnalytic[]>([]);
  const [searches, setSearches] = useState<SearchAnalytic[]>([]);

  // Fetch Data on Load
  useEffect(() => {
    fetchLogsAndAnalytics();
  }, [activeTab]);

  const fetchLogsAndAnalytics = async () => {
    try {
      if (activeTab === "cron") {
        const res = await fetch("/api/cron/logs");
        if (res.ok) setCronLogs(await res.json());
      }
      if (activeTab === "analytics") {
        const [clicksRes, searchRes] = await Promise.all([
          fetch("/api/analytics/clicks"),
          fetch("/api/analytics/searches")
        ]);
        if (clicksRes.ok) setClicks(await clicksRes.json());
        if (searchRes.ok) setSearches(await searchRes.json());
      }
    } catch (e) {
      console.error("Error fetching admin logs", e);
    }
  };

  // Import Action
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importContent.trim()) return;

    setIsImporting(true);
    setImportSuccess(null);
    setImportError(null);

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format: importType,
          data: importContent
        })
      });

      const result = await res.json();
      if (res.ok) {
        setImportSuccess(`Berhasil mengimpor ${result.count} produk ke database!`);
        setImportContent("");
      } else {
        setImportError(result.error || "Gagal mengimpor produk. Pastikan format valid.");
      }
    } catch (err) {
      setImportError("Kesalahan jaringan saat mengimpor data.");
    } finally {
      setIsImporting(false);
    }
  };

  // Trigger Cron Manual Sync
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/cron/sync", { method: "POST" });
      if (res.ok) {
        alert("Simulasi sinkronisasi harga & stok partner e-commerce berhasil!");
        fetchLogsAndAnalytics();
      }
    } catch (e) {
      console.error("Failed to sync prices", e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Generate AI Article
  const handleGenerateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleKeyword.trim()) return;

    setIsGeneratingArticle(true);
    setAiArticleResult(null);

    try {
      const res = await fetch("/api/articles/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: articleKeyword.trim(),
          type: articleType
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiArticleResult(data);
        setArticleKeyword("");
      } else {
        alert("Gagal men-generate artikel. Hubungi tim teknis.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  // Generate AI Programmatic SEO Page
  const handleGenerateSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoKeyword.trim()) return;

    setIsGeneratingSeo(true);
    setAiSeoResult(null);

    try {
      const res = await fetch("/api/programmatic-pages/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: seoKeyword.trim(),
          category: seoCategory
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiSeoResult(data);
        setSeoKeyword("");
      } else {
        alert("Gagal memproduksi halaman SEO.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans" id="admin-panel-root">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gray-950 text-white rounded-2xl">
            <Shield className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-gray-900 flex items-center gap-1.5">
              Admin & Affiliate Engine Control <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[8px] rounded font-mono uppercase font-bold">Secure</span>
            </h1>
            <p className="text-xs text-gray-400">Pusat kelola partner affiliate, auto-sync, blog generator, dan analitik trafik</p>
          </div>
        </div>

        {/* Tab triggers */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab("importer")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "importer" ? "bg-rose-500 text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Multi-Format Importer
          </button>
          <button
            onClick={() => setActiveTab("cron")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "cron" ? "bg-rose-500 text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Price Scheduler (Cron)
          </button>
          <button
            onClick={() => setActiveTab("article")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "article" ? "bg-rose-500 text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            AI Blog Writer
          </button>
          <button
            onClick={() => setActiveTab("p-seo")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "p-seo" ? "bg-rose-500 text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Programmatic SEO AI
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === "analytics" ? "bg-rose-500 text-white shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            Analytics Traffic
          </button>
        </div>
      </div>

      {/* Main tab layouts rendering */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-2xs">
        
        {/* TAB 1: PRODUCT IMPORTER */}
        {activeTab === "importer" && (
          <div className="space-y-6" id="tab-importer">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <UploadCloud className="h-5 w-5 text-rose-500" /> Multi-Format Product Importer
              </h2>
              <p className="text-xs text-gray-500 mt-1">Impor ratusan produk affiliate baru dari file CSV, XML, atau raw JSON dari e-commerce</p>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="flex gap-4">
                {["json", "csv", "xml"].map(f => (
                  <label key={f} className="flex items-center space-x-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value={f}
                      checked={importType === f}
                      onChange={() => setImportType(f)}
                      className="text-rose-500 focus:ring-rose-400 h-4 w-4"
                    />
                    <span className="uppercase">{f} Format</span>
                  </label>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Konten Mentah Data Produk</label>
                <textarea
                  rows={8}
                  placeholder={
                    importType === "json"
                      ? '[\n  {\n    "name": "ASUS TUF A15",\n    "brand": "ASUS",\n    "category": "laptop-komputer",\n    "price": 14500000,\n    "discount": 5,\n    "platform": "Shopee",\n    "affiliateUrl": "https://shopee.co.id"\n  }\n]'
                      : importType === "csv"
                      ? 'name,brand,category,price,discount,platform,affiliateUrl\nASUS TUF A15,ASUS,laptop-komputer,14500000,5,Shopee,https://shopee.co.id'
                      : '<products>\n  <product>\n    <name>ASUS TUF A15</name>\n    <brand>ASUS</brand>\n    <category>laptop-komputer</category>\n    <price>14500000</price>\n    <discount>5</discount>\n    <platform>Shopee</platform>\n    <affiliateUrl>https://shopee.co.id</affiliateUrl>\n  </product>\n</products>'
                  }
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-2xl text-xs font-mono text-gray-700 focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              {importSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{importSuccess}</span>
                </div>
              )}

              {importError && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-xs flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{importError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isImporting || !importContent.trim()}
                className="px-5 py-2.5 bg-gray-900 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
              >
                {isImporting ? "Mengimpor Data..." : "Impor ke Database"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: CRON SCHEDULER */}
        {activeTab === "cron" && (
          <div className="space-y-6" id="tab-cron">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Database className="h-5 w-5 text-rose-500" /> Automated Price & Stock Synchronizer (Cron Simulator)
                </h2>
                <p className="text-xs text-gray-500 mt-1">Sinkronisasi otomatis stok, diskon, kupon, dan fluktuasi harga barang partner e-commerce secara periodik</p>
              </div>

              <button
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition flex items-center space-x-1 shrink-0 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                <span>Trigger Manual Sync</span>
              </button>
            </div>

            <div className="bg-gray-950 rounded-2xl p-5 text-white">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">
                <Terminal className="h-4 w-4 text-rose-400" />
                <span>Simulated Cron Logs Server Terminal</span>
              </div>

              <div className="font-mono text-[10px] space-y-2.5 max-h-64 overflow-y-auto">
                {cronLogs.length > 0 ? (
                  cronLogs.map((log) => (
                    <div key={log.id} className="border-b border-gray-900 pb-2.5">
                      <div className="flex justify-between text-gray-500">
                        <span>ID: {log.id} &bull; Timestamp: {log.timestamp}</span>
                        <span className="text-emerald-400 font-bold">STATUS: COMPLETED</span>
                      </div>
                      <div className="text-gray-300 mt-1">
                        &bull; Memproses update fluktuasi harga untuk <span className="text-amber-300">{log.productsProcessed}</span> produk affiliate.<br/>
                        &bull; Berhasil menembus API Shopee, Tokopedia, TikTok Shop, Blibli.<br/>
                        &bull; Memicu <span className="text-rose-400 font-bold">{log.alertsTriggered}</span> price drops alert yang didaftarkan pembeli.
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">Belum ada aktivitas cron terdaftar. Klik &quot;Trigger Manual Sync&quot; untuk memulai.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI BLOG ARTICLE WRITER */}
        {activeTab === "article" && (
          <div className="space-y-6" id="tab-article">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <PenTool className="h-5 w-5 text-rose-500" /> Gemini AI Article Writer & SEO Auto-Publisher
              </h2>
              <p className="text-xs text-gray-500 mt-1">Masukkan kata kunci barang viral Indonesia dan biarkan Gemini AI `gemini-3.5-flash` memproduksi ulasan edukatif lengkap dengan skema</p>
            </div>

            <form onSubmit={handleGenerateArticle} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Target Kata Kunci / Keyword Utama</label>
                <input
                  type="text"
                  placeholder="Contoh: Kelebihan Asus ROG Ally dibanding Steam Deck Indonesia"
                  required
                  value={articleKeyword}
                  onChange={(e) => setArticleKeyword(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Jenis Artikel</label>
                <select
                  value={articleType}
                  onChange={(e) => setArticleType(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 focus:outline-none focus:border-rose-400"
                >
                  <option value="Review Produk">Ulasan Produk (Review)</option>
                  <option value="Perbandingan Produk">Komparasi Spek</option>
                  <option value="Buying Guide">Panduan Belanja</option>
                  <option value="Tutorial">Tips & Tutorial</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGeneratingArticle || !articleKeyword.trim()}
                className="md:col-span-3 h-10 bg-gray-900 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>{isGeneratingArticle ? "Model Gemini Sedang Menulis Draft..." : "Tulis & Publish Artikel Secara Otomatis"}</span>
              </button>
            </form>

            {aiArticleResult && (
              <div className="p-5 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-3 animate-in fade-in">
                <div className="flex items-center space-x-1.5 text-xs text-rose-600 font-bold">
                  <CheckCircle className="h-4 w-4" />
                  <span>Sukses! Artikel AI Terpublikasi ke Blog CMS.</span>
                </div>
                <h3 className="text-xs font-extrabold text-gray-900">{aiArticleResult.title}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed italic line-clamp-3">
                  &ldquo;{aiArticleResult.metaDescription}&rdquo;
                </p>
                <button
                  onClick={() => setRoute(`#/blog/${aiArticleResult.slug}`)}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center space-x-0.5"
                >
                  <span>Buka Artikel Terbitan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROGRAMMATIC SEO GENERATOR */}
        {activeTab === "p-seo" && (
          <div className="space-y-6" id="tab-p-seo">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-rose-500 fill-rose-500" /> Programmatic SEO AI Auto-Builder
              </h2>
              <p className="text-xs text-gray-500 mt-1">Produksi ribuan landing page bertarget kata kunci spesifik secara instan untuk melipatgandakan indeks pencarian Google Adsense</p>
            </div>

            <form onSubmit={handleGenerateSeo} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Fokus Pencarian / Kata Kunci SEO</label>
                <input
                  type="text"
                  placeholder="Contoh: Sepatu Olahraga Specs Lari Murah"
                  required
                  value={seoKeyword}
                  onChange={(e) => setSeoKeyword(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Kategori Induk</label>
                <select
                  value={seoCategory}
                  onChange={(e) => setSeoCategory(e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 focus:outline-none focus:border-rose-400"
                >
                  <option value="gadget-handphone">Gadget & Handphone</option>
                  <option value="laptop-komputer">Laptop & Komputer</option>
                  <option value="olahraga-outdoor">Olahraga & Outdoor</option>
                  <option value="peralatan-rumah-tangga">Peralatan Rumah Tangga</option>
                  <option value="fashion-lifestyle">Fashion & Lifestyle</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGeneratingSeo || !seoKeyword.trim()}
                className="md:col-span-3 h-10 bg-gray-900 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>{isGeneratingSeo ? "Gemini AI Sedang Menulis Skema Halaman..." : "Produksi Halaman Programmatic SEO Baru"}</span>
              </button>
            </form>

            {aiSeoResult && (
              <div className="p-5 bg-rose-50/40 rounded-2xl border border-rose-100 space-y-3 animate-in fade-in">
                <div className="flex items-center space-x-1.5 text-xs text-rose-600 font-bold">
                  <CheckCircle className="h-4 w-4" />
                  <span>Sukses! Halaman Programmatic SEO Baru Terbit.</span>
                </div>
                <h3 className="text-xs font-extrabold text-gray-900">{aiSeoResult.keyword} Terbaik</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed italic line-clamp-3">
                  &ldquo;{aiSeoResult.metaDescription}&rdquo;
                </p>
                <button
                  onClick={() => setRoute(`#/p/${aiSeoResult.slug}`)}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center space-x-0.5"
                >
                  <span>Lihat Hasil Landing Page</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ANALYTICS & LOG OUTBOUND CLICKS */}
        {activeTab === "analytics" && (
          <div className="space-y-8" id="tab-analytics">
            <div>
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <BarChart3 className="h-5 w-5 text-rose-500" /> Real-time Affiliate Outbound Analytics Logger
              </h2>
              <p className="text-xs text-gray-500 mt-1">Lacak mana saja link produk affiliate partner yang aktif diklik pengguna dan di-search dari halaman depan</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Outbound Clicks Logger Table */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-50">
                  Log Klik Outbound Link Mitra (Shopee, Toko, dll)
                </h3>
                <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150 text-gray-400 font-bold">
                        <th className="p-3">Waktu</th>
                        <th className="p-3">Product ID</th>
                        <th className="p-3">Partner</th>
                        <th className="p-3">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clicks.length > 0 ? (
                        clicks.map((c) => (
                          <tr key={c.id} className="border-b border-gray-50 text-gray-600">
                            <td className="p-3 font-mono text-[10px] text-gray-400">{c.timestamp}</td>
                            <td className="p-3">{c.productId}</td>
                            <td className="p-3 font-bold text-gray-900 uppercase">{c.platform}</td>
                            <td className="p-3 text-gray-400">{c.referrer}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-gray-400 italic">Belum ada log klik tercatat.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Internal Searches Log */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-50">
                  Kata Kunci Paling Banyak Dicari Pengunjung
                </h3>
                <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-150 text-gray-400 font-bold">
                        <th className="p-3">Waktu</th>
                        <th className="p-3">Kata Kunci (Search Term)</th>
                        <th className="p-3">IP Prefix</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searches.length > 0 ? (
                        searches.map((s) => (
                          <tr key={s.id} className="border-b border-gray-50 text-gray-600">
                            <td className="p-3 font-mono text-[10px] text-gray-400">{s.timestamp}</td>
                            <td className="p-3 font-bold text-gray-800">&ldquo;{s.term}&rdquo;</td>
                            <td className="p-3 text-gray-400 font-mono text-[10px]">182.16.*.*</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-gray-400 italic">Belum ada pencarian tercatat.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
