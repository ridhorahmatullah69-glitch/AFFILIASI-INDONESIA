import React, { useState, useEffect } from "react";
import { 
  Flame, 
  Tag, 
  Award, 
  ChevronRight, 
  Smartphone, 
  Laptop, 
  Dumbbell, 
  Home as HomeIcon, 
  Shirt, 
  HelpCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles,
  TrendingUp,
  Percent,
  Compass,
  ArrowDownToLine,
  Zap
} from "lucide-react";
import { Product, Category, Brand, BlogArticle, ProgrammaticPage } from "../types.js";

interface HomeViewProps {
  setRoute: (route: string) => void;
  addToWishlist: (p: Product) => void;
  wishlist: Product[];
  addToCompare: (p: Product) => void;
  compareList: Product[];
}

export default function HomeView({ setRoute, addToWishlist, wishlist, addToCompare, compareList }: HomeViewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [editorChoiceProducts, setEditorChoiceProducts] = useState<Product[]>([]);
  const [latestArticles, setLatestArticles] = useState<BlogArticle[]>([]);
  const [programmaticPages, setProgrammaticPages] = useState<ProgrammaticPage[]>([]);
  
  // Timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Vouchers Data
  const vouchers = [
    { id: "v-1", store: "Shopee", code: "SHPE100K", desc: "Cashback 10% s/d Rp100.000", tnc: "Min. Belanja Rp300.000, Semua Kategori", url: "https://shopee.co.id" },
    { id: "v-2", store: "Tokopedia", code: "TOKOHEBAT50", desc: "Diskon Langsung Rp50.000", tnc: "Min. Belanja Rp150.000, Official Store", url: "https://www.tokopedia.com" },
    { id: "v-3", store: "TikTok Shop", code: "TIKTOKAI25", desc: "Potongan Rp25.000", tnc: "Tanpa Minimal Belanja, Produk Gadget AI", url: "https://www.tiktok.com" },
    { id: "v-4", store: "Blibli", code: "BLIPAS15", desc: "Cashback Rp15.000 Tanpa Kuota", tnc: "Khusus Pembayaran Elektronik Rumah Tangga", url: "https://www.blibli.com" }
  ];

  // FAQ Data
  const faqs = [
    { q: "Apakah AFILIASI.ID menjual produk secara langsung?", a: "Tidak. AFILIASI.ID adalah portal perbandingan harga, direktori affiliate, dan media review produk secara independen. Kami memandu Anda merekomendasikan diskon terbesar dan mengarahkan langsung ke Shopee, Tokopedia, Lazada, dll." },
    { q: "Bagaimana cara kerja Smart Price Comparison?", a: "Sistem kami mengumpulkan harga dari berbagai marketplace secara berkala, lalu mengurutkannya mulai dari yang paling murah. Anda bebas memilih e-commerce terpercaya untuk checkout." },
    { q: "Apakah kupon promo di situs ini bisa digunakan?", a: "Tentu! Semua kupon promo dan kode voucher dikumpulkan dari official store e-commerce bersangkutan. Cukup salin kodenya dan masukkan di halaman pembayaran marketplace tujuan." },
    { q: "Bagaimana review AI diproduksi?", a: "Kami menggunakan model Gemini 3.5 Flash untuk menganalisis ratusan sentimen ulasan pembeli asli dan spesifikasi teknis mentah, menghasilkan rangkuman ulasan pro & kontra yang jujur serta objektif." }
  ];

  useEffect(() => {
    // Timer Tick
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 }; // reset
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch data from backend APIs
    const fetchData = async () => {
      try {
        const [catsRes, brandsRes, productsRes, articlesRes, pagesRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/brands"),
          fetch("/api/products"),
          fetch("/api/articles"),
          fetch("/api/programmatic-pages")
        ]);

        if (catsRes.ok) setCategories(await catsRes.json());
        if (brandsRes.ok) setBrands(await brandsRes.json());
        if (productsRes.ok) {
          const prods: Product[] = await productsRes.json();
          setTrendingProducts(prods.filter(p => p.isTrending));
          setDealProducts(prods.filter(p => p.salesCount > 1000));
          setEditorChoiceProducts(prods.filter(p => p.isEditorChoice));
        }
        if (articlesRes.ok) setLatestArticles((await articlesRes.json()).slice(0, 3));
        if (pagesRes.ok) setProgrammaticPages(await pagesRes.json());
      } catch (e) {
        console.error("HomeView fetching data error", e);
      }
    };
    fetchData();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const getCatIcon = (iconName: string) => {
    switch (iconName) {
      case "Smartphone": return <Smartphone className="h-5 w-5" />;
      case "Laptop": return <Laptop className="h-5 w-5" />;
      case "Dumbbell": return <Dumbbell className="h-5 w-5" />;
      case "Home": return <HomeIcon className="h-5 w-5" />;
      case "Shirt": return <Shirt className="h-5 w-5" />;
      default: return <Compass className="h-5 w-5" />;
    }
  };

  const logAffiliateClick = (product: Product, platform: string, affUrl: string) => {
    fetch("/api/analytics/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, platform, referrer: "Homepage_Quick_Buy" })
    }).catch(err => console.error(err));
    window.open(affUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50/50 py-16 lg:py-24" id="home-hero">
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-rose-200/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-amber-200/15 blur-3xl"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 mb-6 border border-rose-100">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smart Affiliate Aggregator Terbesar</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-sans leading-none">
            Bandingkan Harga Terendah,<br/>
            Dapatkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500">Deals Terbesar!</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base text-gray-500 leading-relaxed">
            Portal cerdas Indonesia untuk mengagregasi jutaan produk affiliate. Lacak grafik riwayat harga, nikmati rekomendasi ringkasan ulasan berbasis AI, dan hemat anggaran belanja Anda secara instan.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setRoute("#/search")}
              className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-xs font-bold text-white transition shadow-lg flex items-center space-x-2 active:scale-95"
            >
              <span>Mulai Cari Produk</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("vouchers-sec");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition flex items-center space-x-1.5"
            >
              <span>Klaim Voucher Belanja</span>
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* 2. CATEGORIES ROW */}
        <section id="categories-sec">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Jelajahi Kategori Populer</h2>
              <p className="text-xs text-gray-500">Pilih kategori produk idaman Anda untuk mulai membandingkan</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setRoute(`#/search?category=${cat.slug}`)}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-100 bg-white hover:border-rose-300 hover:shadow-lg transition duration-250 cursor-pointer text-center"
              >
                <div className="p-3.5 bg-gray-50 text-gray-700 rounded-xl group-hover:bg-rose-50 group-hover:text-rose-500 transition mb-3">
                  {getCatIcon(cat.iconName)}
                </div>
                <span className="text-xs font-bold text-gray-800">{cat.name}</span>
                <span className="text-[10px] text-gray-400 mt-1 line-clamp-1">{cat.description || "Review AI & Harga"}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. FLASH SALE & TODAY'S DEALS */}
        <section className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/50 via-white to-amber-50/40 p-6 sm:p-8" id="flash-sale-sec">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white animate-pulse">
                <Flame className="h-5 w-5 fill-white" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 uppercase tracking-tight flex items-center gap-1.5">
                  Flash Sale Hari Ini <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] rounded font-mono font-bold">HOT</span>
                </h3>
                <p className="text-xs text-gray-500">Diskon produk tergila, stok terbatas hasil kurasi editor</p>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center space-x-2 text-xs font-bold">
              <span className="text-gray-400 font-medium">Sisa Waktu:</span>
              <div className="flex space-x-1 font-mono text-xs">
                <span className="px-2 py-1 bg-gray-900 text-white rounded-lg">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="text-gray-900">:</span>
                <span className="px-2 py-1 bg-gray-900 text-white rounded-lg">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="text-gray-900">:</span>
                <span className="px-2 py-1 bg-gray-900 text-white rounded-lg">{String(timeLeft.seconds).padStart(2, "0")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealProducts.slice(0, 3).map((product) => {
              const bestAff = product.affiliates.sort((a, b) => a.price - b.price)[0];
              const soldPercentage = Math.floor((product.salesCount / (product.salesCount + 150)) * 100);
              return (
                <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                  <div>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-50 mb-3 group">
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-lg flex items-center space-x-0.5">
                        <Zap className="h-2.5 w-2.5 fill-white" />
                        <span>Diskon {bestAff?.discount || 15}%</span>
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-gray-900/80 backdrop-blur-md text-white text-[9px] font-mono rounded">
                        {product.brand}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-gray-900 hover:text-rose-500 cursor-pointer transition line-clamp-1" onClick={() => setRoute(`#/product/${product.slug}`)}>
                      {product.name}
                    </h4>
                    
                    <div className="flex items-baseline space-x-2 mt-1.5">
                      <span className="text-xs font-black text-rose-600 font-mono">Rp {product.lowestPrice.toLocaleString('id-ID')}</span>
                      {bestAff?.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through font-mono">Rp {bestAff.originalPrice.toLocaleString('id-ID')}</span>
                      )}
                    </div>

                    {/* Stock status indicator */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[9px] font-semibold text-gray-500">
                        <span>Hampir Habis</span>
                        <span>Terjual {product.salesCount} unit</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${soldPercentage}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-3 mt-4 flex items-center justify-between gap-2">
                    <button 
                      onClick={() => setRoute(`#/product/${product.slug}`)} 
                      className="text-[11px] font-bold text-gray-700 hover:text-rose-500 transition"
                    >
                      Bandingkan Harga
                    </button>
                    <button
                      onClick={() => logAffiliateClick(product, bestAff.platform, bestAff.affiliateUrl)}
                      className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-extrabold flex items-center space-x-1"
                    >
                      <span>Beli di {bestAff.platform}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. VOUCHERS LIST */}
        <section id="vouchers-sec" className="scroll-mt-20">
          <div className="flex items-center space-x-2 mb-6">
            <Tag className="h-5 w-5 text-rose-500" />
            <div>
              <h3 className="text-base font-bold text-gray-900">Kupon & Voucher Cashback Partner</h3>
              <p className="text-xs text-gray-500">Salin kode voucher eksklusif di bawah ini dan hemat belanjaan Anda</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vouchers.map((v) => (
              <div key={v.id} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col justify-between group">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 h-12 w-12 rounded-full bg-rose-50/50 group-hover:bg-rose-50 transition duration-300"></div>
                <div>
                  <span className="px-2 py-0.5 bg-gray-900 text-white text-[9px] font-mono font-extrabold rounded-lg uppercase">
                    {v.store}
                  </span>
                  <h4 className="text-xs font-extrabold text-gray-800 mt-2.5 leading-tight">{v.desc}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 leading-snug">{v.tnc}</p>
                </div>

                <div className="border-t border-dashed border-gray-150 pt-3 mt-4 flex items-center justify-between gap-1">
                  <div className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-mono font-bold text-gray-700 flex items-center space-x-1 shrink-0">
                    <span>{v.code}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(v.code)}
                    className="p-1.5 text-gray-500 hover:text-rose-500 transition rounded-lg hover:bg-gray-50"
                    title="Salin Kode Kupon"
                  >
                    {copiedCode === v.code ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. TRENDING & VIRAL PRODUCTS */}
        <section id="trending-products">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                <TrendingUp className="h-5 w-5 text-amber-500" /> Produk Trending & Viral Indonesia
              </h2>
              <p className="text-xs text-gray-500">Produk yang paling banyak direview, dicari, dan diklik minggu ini</p>
            </div>
            <button onClick={() => setRoute("#/search")} className="text-xs font-bold text-rose-500 hover:text-rose-600 transition flex items-center gap-0.5 mt-2 md:mt-0">
              <span>Lihat Semua Produk</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => {
              const bestAff = product.affiliates.sort((a, b) => a.price - b.price)[0];
              const isInWishlist = wishlist.some(w => w.id === product.id);
              const isInCompare = compareList.some(c => c.id === product.id);
              
              return (
                <div key={product.id} className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 mb-3">
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && (
                          <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded">BARU</span>
                        )}
                        {product.isViral && (
                          <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-bold rounded">VIRAL</span>
                        )}
                      </div>
                    </div>

                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{product.brand}</span>
                    <h3 
                      onClick={() => setRoute(`#/product/${product.slug}`)}
                      className="text-xs font-bold text-gray-900 hover:text-rose-500 transition cursor-pointer line-clamp-2 mt-1 min-h-[32px]"
                    >
                      {product.name}
                    </h3>

                    {/* Specifications badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(product.specs).slice(0, 2).map(([key, value], idx) => {
                        const valStr = String(value);
                        return (
                          <span key={idx} className="px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded text-[9px] font-mono leading-none border border-gray-150">
                            {key}: {valStr.length > 12 ? valStr.substring(0, 10) + "..." : valStr}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-baseline justify-between mt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400">Harga Termurah</span>
                        <span className="text-xs font-extrabold text-gray-950 font-mono">Rp {product.lowestPrice.toLocaleString('id-ID')}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded font-bold font-mono">
                        {product.affiliates.length} Marketplace
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between gap-2">
                    <button
                      onClick={() => addToCompare(product)}
                      className={`text-[10px] font-bold transition flex items-center space-x-1 ${
                        isInCompare ? "text-rose-500" : "text-gray-500 hover:text-rose-500"
                      }`}
                    >
                      <span>{isInCompare ? "Dibandingkan" : "Bandingkan"}</span>
                    </button>
                    <button
                      onClick={() => addToWishlist(product)}
                      className={`text-[10px] font-bold transition flex items-center space-x-1 ${
                        isInWishlist ? "text-rose-500" : "text-gray-500 hover:text-rose-500"
                      }`}
                    >
                      <span>{isInWishlist ? "Bookmarked" : "Wishlist"}</span>
                    </button>
                    <button
                      onClick={() => setRoute(`#/product/${product.slug}`)}
                      className="px-2.5 py-1.5 bg-gray-900 hover:bg-rose-500 hover:text-white text-white rounded-lg text-[9px] font-bold transition"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 6. EDITOR'S CHOICE / BUYING GUIDES */}
        <section id="editors-choice">
          <div className="flex items-center space-x-2 mb-6">
            <Award className="h-5 w-5 text-amber-500" />
            <div>
              <h3 className="text-base font-bold text-gray-900">Pilihan Utama Editor (Editor's Choice)</h3>
              <p className="text-xs text-gray-500">Rekomendasi barang premium paling awet, bergaransi resmi terbaik</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editorChoiceProducts.slice(0, 2).map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition">
                <img src={product.images[0]} alt={product.name} className="h-32 w-32 object-cover rounded-xl border border-gray-100 shrink-0" />
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[8px] font-bold rounded">RECOMMENDED</span>
                    <h4 
                      onClick={() => setRoute(`#/product/${product.slug}`)}
                      className="text-xs font-bold text-gray-900 hover:text-rose-500 cursor-pointer transition mt-2"
                    >
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">{product.description}</p>
                    {product.aiSummary && (
                      <div className="mt-2.5 p-2 bg-rose-50/50 rounded-lg border border-rose-100 text-[10px] text-gray-600 leading-relaxed italic">
                        &ldquo;{product.aiSummary}&rdquo;
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                    <span className="text-[11px] font-mono text-rose-500 font-extrabold">Mulai Rp {product.lowestPrice.toLocaleString('id-ID')}</span>
                    <button 
                      onClick={() => setRoute(`#/product/${product.slug}`)}
                      className="text-[10px] font-bold text-gray-900 hover:text-rose-500 flex items-center"
                    >
                      <span>Lihat Riwayat Harga</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. LATEST ARTICLES */}
        <section id="blog-preview">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Ulasan & Panduan Belanja Terbaru</h2>
              <p className="text-xs text-gray-500">Artikel edukatif, perbandingan spesifikasi, dan tips anti rugi belanja</p>
            </div>
            <button onClick={() => setRoute("#/blog")} className="text-xs font-bold text-rose-500 hover:text-rose-600 transition flex items-center gap-0.5">
              <span>Buka Blog CMS</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((art) => (
              <div key={art.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-lg transition">
                <div className="aspect-video relative overflow-hidden bg-gray-50 border-b border-gray-100">
                  <img src={art.featuredImage} alt={art.title} className="h-full w-full object-cover group-hover:scale-103 transition duration-500" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-gray-900/80 text-white text-[9px] font-bold rounded">
                    {art.type}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[9px] font-semibold text-rose-500 font-mono">{art.publishDate} &bull; {art.views} Dilihat</span>
                  <h3 
                    onClick={() => setRoute(`#/blog/${art.slug}`)}
                    className="text-xs font-bold text-gray-900 hover:text-rose-500 transition cursor-pointer mt-1 line-clamp-2 min-h-[32px]"
                  >
                    {art.title}
                  </h3>
                  <div className="border-t border-gray-50 pt-3 mt-4 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Oleh {art.author}</span>
                    <button onClick={() => setRoute(`#/blog/${art.slug}`)} className="text-rose-500 font-bold hover:underline">Baca Selengkapnya</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. PROGRAMMATIC SEO DIRECTORY (Sitemap / Ribuan Halaman Otomatis) */}
        {programmaticPages.length > 0 && (
          <section className="bg-gray-50/50 rounded-2xl border border-gray-100 p-6" id="p-seo-dir">
            <h4 className="text-xs font-bold text-gray-900 tracking-wider uppercase mb-3.5">Direktori Pencarian Cepat (Programmatic SEO)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {programmaticPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setRoute(`#/p/${page.slug}`)}
                  className="px-3 py-2 text-left bg-white hover:bg-rose-50 hover:text-rose-600 rounded-xl text-[11px] font-semibold text-gray-700 transition border border-gray-150 line-clamp-1"
                >
                  &bull; {page.keyword} Terbaik
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 9. FAQ ACCORDION BLOCK (Schema.org compliant) */}
        <section id="faq-sec">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <HelpCircle className="mx-auto h-8 w-8 text-rose-500 mb-2" />
            <h2 className="text-lg font-bold text-gray-900">FAQ & Panduan Umum Affiliate</h2>
            <p className="text-xs text-gray-500">Ketahui cara belanja hemat, legalitas komparasi, dan keaslian link partner kami</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 bg-white border border-gray-100 rounded-2xl">
                <h4 className="text-xs font-extrabold text-gray-900">{faq.q}</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
