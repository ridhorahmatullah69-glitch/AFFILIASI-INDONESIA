import React, { useState, useEffect } from "react";
import { 
  Star, 
  ExternalLink, 
  TrendingDown, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Share2, 
  Heart, 
  GitCompare, 
  Bell, 
  Clock, 
  ArrowLeft,
  Youtube,
  Shield,
  HelpCircle,
  Percent,
  Check
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Product, AffiliateLink, PriceHistory } from "../types.js";

interface ProductDetailProps {
  slug: string;
  setRoute: (route: string) => void;
  addToWishlist: (p: Product) => void;
  wishlist: Product[];
  addToCompare: (p: Product) => void;
  compareList: Product[];
}

export default function ProductDetailView({ slug, setRoute, addToWishlist, wishlist, addToCompare, compareList }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState("");
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Price Alert Subscription Form State
  const [alertEmail, setAlertEmail] = useState("");
  const [alertTargetPrice, setAlertTargetPrice] = useState("");
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data: Product = await res.json();
          setProduct(data);
          setActiveImage(data.images[0]);

          // Fetch similar products in same category
          const simRes = await fetch(`/api/products?category=${data.category}`);
          if (simRes.ok) {
            const simData: Product[] = await simRes.json();
            setSimilarProducts(simData.filter(p => p.id !== data.id).slice(0, 4));
          }
        }
      } catch (e) {
        console.error("Fetch product details error", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductDetails();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center animate-pulse space-y-4">
        <div className="h-6 bg-gray-150 rounded w-1/4 mx-auto"></div>
        <div className="h-96 bg-gray-100 rounded-2xl w-full max-w-3xl mx-auto"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-gray-400 mt-2">Produk yang Anda cari mungkin telah dihapus atau ganti nama.</p>
        <button onClick={() => setRoute("#/search")} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold transition">
          Kembali Cari Produk
        </button>
      </div>
    );
  }

  // Multi-affiliate links sorted by cheapest price first
  const sortedAffiliates = [...product.affiliates].sort((a, b) => a.price - b.price);
  const bestAffiliate = sortedAffiliates[0];

  const isInWishlist = wishlist.some(w => w.id === product.id);
  const isInCompare = compareList.some(c => c.id === product.id);

  const handleAlertSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail.trim() || !alertTargetPrice) return;

    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          targetPrice: parseFloat(alertTargetPrice),
          email: alertEmail.trim()
        })
      });
      if (res.ok) {
        setAlertSuccess(true);
        setAlertEmail("");
        setAlertTargetPrice("");
        setTimeout(() => setAlertSuccess(false), 5000);
      }
    } catch (e) {
      console.error("Price alert subscription failure", e);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Tautan produk telah disalin ke clipboard!");
  };

  const logAffiliateClick = (platform: string, affUrl: string) => {
    fetch("/api/analytics/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, platform, referrer: `ProductDetail_${platform}` })
    }).catch(err => console.error(err));
    window.open(affUrl, "_blank", "noopener,noreferrer");
  };

  // Prepare recharts data format
  // Recharts requires pricing values
  const chartData = product.priceHistory || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-[11px] font-semibold text-gray-400 mb-6">
        <button onClick={() => setRoute("#/")} className="hover:text-gray-900 transition">Beranda</button>
        <span>/</span>
        <button onClick={() => setRoute(`#/search?category=${product.category}`)} className="hover:text-gray-900 transition capitalize">{product.category.replace("-", " ")}</button>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      {/* Main product view block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-2xs">
        
        {/* Left Column: Image Zoom Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 relative group cursor-zoom-in">
            <img src={activeImage} alt={product.name} className="h-full w-full object-cover group-hover:scale-108 transition duration-500" />
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-gray-900/80 text-white text-[9px] font-mono rounded">
              ZOOM ACTIVE
            </span>
          </div>

          {/* Sub thumbnails lists */}
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`h-16 w-16 rounded-xl overflow-hidden border transition shrink-0 ${
                  activeImage === img ? "border-rose-500 scale-95" : "border-gray-150 hover:border-gray-300"
                }`}
              >
                <img src={img} alt="sub" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* Video display */}
          {product.videoUrl && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-lg bg-red-100 text-red-500 flex items-center justify-center">
                  <Youtube className="h-4 w-4 fill-red-500" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-gray-900">Video Demo & Unboxing</h4>
                  <p className="text-[9px] text-gray-400">Tinjau ulasan rilis video di YouTube</p>
                </div>
              </div>
              <a 
                href={product.videoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-extrabold rounded-lg flex items-center space-x-1"
              >
                <span>Tonton</span>
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Title, Quick Specs, Buying links table */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              <span className="text-rose-500">{product.brand}</span>
              <span>&bull;</span>
              <span>{product.category.replace("-", " ")}</span>
              {product.isOfficial && (
                <>
                  <span>&bull;</span>
                  <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded leading-none">OFFICIAL STORE</span>
                </>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-black text-gray-700">{product.rating}</span>
                <span className="text-[10px] text-gray-400">({product.reviewCount} reviews)</span>
              </div>
              <span className="h-3.5 w-px bg-gray-200"></span>
              <span className="text-[10px] font-semibold text-gray-500">Terjual {product.salesCount}+ Unit</span>
            </div>
          </div>

          {/* Smart Price Comparison Matrix (Urut Termurah) */}
          <div className="p-5 bg-gradient-to-tr from-gray-50 via-white to-gray-50 border border-gray-100 rounded-2xl">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5 mb-3.5">
              <Sparkles className="h-4 w-4 text-rose-500 animate-pulse" /> Bandingkan Harga Termurah (Smart Match)
            </h3>

            <div className="space-y-2.5">
              {sortedAffiliates.map((aff) => (
                <div 
                  key={aff.id} 
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-150 bg-white hover:border-rose-200 hover:bg-rose-50/20 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 bg-gray-900 text-white text-[9px] font-mono font-black rounded-lg uppercase">
                      {aff.platform}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-gray-900 font-mono">Rp {aff.price.toLocaleString('id-ID')}</span>
                        {aff.discount > 0 && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 text-[8px] font-extrabold rounded leading-none">
                            -{aff.discount}%
                          </span>
                        )}
                      </div>
                      {aff.originalPrice && aff.discount > 0 && (
                        <span className="text-[9px] text-gray-400 line-through leading-none mt-0.5">
                          Rp {aff.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {aff.couponCode && (
                      <span className="hidden sm:inline px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[8px] font-mono rounded">
                        Kupon: {aff.couponCode}
                      </span>
                    )}
                    <button
                      onClick={() => logAffiliateClick(aff.platform, aff.affiliateUrl)}
                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-lg text-[10px] font-extrabold flex items-center space-x-1 transition"
                    >
                      <span>Beli</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="p-3.5 bg-gray-50 rounded-xl space-y-2">
              <span className="font-bold text-gray-800">Spesifikasi Singkat:</span>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                {product.colors && product.colors.length > 0 && (
                  <li>Warna: {product.colors.join(", ")}</li>
                )}
                {product.sizes && product.sizes.length > 0 && (
                  <li>Ukuran: {product.sizes.join(", ")}</li>
                )}
                {product.warranty && (
                  <li>Garansi: {product.warranty}</li>
                )}
              </ul>
            </div>
            <div className="p-3.5 bg-gray-50 rounded-xl space-y-1.5">
              <span className="font-bold text-gray-800">Informasi Pengiriman:</span>
              <div className="flex flex-col gap-1 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5">{product.freeShipping ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-gray-300" />} Gratis Ongkir</span>
                <span className="flex items-center gap-1.5">{product.cod ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <XCircle className="h-3.5 w-3.5 text-gray-300" />} Mendukung COD</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => addToCompare(product)}
              className={`px-4 py-2 border rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                isInCompare ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <GitCompare className="h-3.5 w-3.5" />
              <span>{isInCompare ? "Ditambahkan di Pembanding" : "Bandingkan Spesifikasi"}</span>
            </button>

            <button
              onClick={() => addToWishlist(product)}
              className={`px-4 py-2 border rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                isInWishlist ? "bg-rose-50 border-rose-200 text-rose-500" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isInWishlist ? "fill-rose-500" : ""}`} />
              <span>{isInWishlist ? "Telah Disimpan" : "Simpan di Wishlist"}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 flex items-center space-x-1.5 transition"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Trend Graph section */}
      {chartData.length > 0 && (
        <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-2xs mt-8" id="price-history-sec">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-rose-500" />
            <div>
              <h2 className="text-sm font-bold text-gray-900">Riwayat & Grafik Fluktuasi Harga (12 Bulan Terakhir)</h2>
              <p className="text-xs text-gray-500">Menganalisis pergerakan diskon terendah untuk mendapatkan harga terbaik.</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="#9ca3af" />
                <YAxis tickFormatter={(v) => `Rp${(v / 1000).toLocaleString('id-ID')}k`} tick={{ fontSize: 9 }} stroke="#9ca3af" />
                <Tooltip formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`]} labelStyle={{ fontSize: 10, fontWeight: "bold" }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {Object.keys(chartData[0] || {}).filter(k => k !== "date").map((key, i) => {
                  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#6366f1"];
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={key}
                      stroke={colors[i % colors.length]}
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Specifications & Advantages, Disadvantages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Specs Table */}
        <div className="lg:col-span-6 bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-50">
            Spesifikasi Lengkap Produk
          </h3>
          <div className="space-y-3 text-xs text-gray-600">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="grid grid-cols-3 py-1.5 border-b border-gray-50">
                <span className="font-bold text-gray-700">{key}</span>
                <span className="col-span-2 text-gray-500">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pros & Cons column */}
        <div className="lg:col-span-6 bg-white border border-gray-100 rounded-3xl p-6 shadow-2xs space-y-6">
          <div>
            <h3 className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Kelebihan Produk
            </h3>
            <ul className="space-y-2 text-xs text-gray-600">
              {product.pros.map((pro, i) => (
                <li key={i} className="flex items-start space-x-2 text-emerald-800">
                  <span className="font-extrabold">&bull;</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-50 pt-4">
            <h3 className="text-xs font-black text-rose-700 uppercase tracking-wider mb-3 flex items-center gap-1">
              <XCircle className="h-4 w-4" /> Kekurangan & Kelemahan
            </h3>
            <ul className="space-y-2 text-xs text-gray-600">
              {product.cons.map((con, i) => (
                <li key={i} className="flex items-start space-x-2 text-rose-800">
                  <span className="font-extrabold">&bull;</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* AI Review & Summary Section */}
      <section className="bg-gradient-to-tr from-gray-900 via-gray-950 to-gray-900 rounded-3xl p-6 sm:p-8 text-white mt-8" id="ai-review-sec">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
              <Sparkles className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Review AI & Rangkuman Sentimen</h2>
              <p className="text-xs text-gray-400">Teknologi Gemini Generative AI untuk menyederhanakan ulasan berbelanja Anda</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-rose-500 text-white text-[9px] font-mono font-bold rounded-full">
            GEMINI ENGINE READY
          </span>
        </div>

        <div className="space-y-4">
          {product.aiSummary && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Ringkasan AI:</h4>
              <p className="text-xs text-gray-200 mt-1 italic">&ldquo;{product.aiSummary}&rdquo;</p>
            </div>
          )}

          {product.aiReview && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Ulasan Objektif Gabungan:</h4>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed font-sans">{product.aiReview}</p>
            </div>
          )}
        </div>
      </section>

      {/* Price Alert Subscribe Section */}
      <section className="bg-white border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-2xs mt-8" id="price-alert-sec">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 mb-4">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Pasang Price Alert (Waspada Harga Turun)</h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Menginginkan produk ini dengan harga yang lebih murah? Pasang price alert sekarang. Kami akan mengirimkan email / notifikasi otomatis ketika harga barang menyentuh nilai target impian Anda!
            </p>
          </div>

          <form onSubmit={handleAlertSubscribe} className="space-y-4">
            {alertSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs flex items-center space-x-2 animate-in fade-in">
                <Check className="h-4 w-4" />
                <span>Price alert terpasang! Notifikasi dikirim saat menyentuh harga Rp {parseFloat(alertTargetPrice || "0").toLocaleString('id-ID')}</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Target Harga Maksimum (Rp)</label>
                    <input
                      type="number"
                      placeholder={`Contoh: ${(product.lowestPrice * 0.95).toFixed(0)}`}
                      required
                      value={alertTargetPrice}
                      onChange={(e) => setAlertTargetPrice(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Email Penerima</label>
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      required
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                      className="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Aktifkan Price Monitor
                </button>
              </>
            )}
          </form>
        </div>
      </section>

      {/* FAQs list for Product Schema index */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 mt-8 shadow-2xs" id="product-faq-sec">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-1">
            <HelpCircle className="h-4 w-4 text-rose-500" /> FAQ Mengenai Produk Ini
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.faqs.map((f, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-rose-500">Q: {f.question}</span>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">A: {f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Similar products */}
      {similarProducts.length > 0 && (
        <section className="mt-12" id="similar-products-sec">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Produk Serupa / Terkait</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <div key={p.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition">
                <div>
                  <img src={p.images[0]} alt={p.name} className="h-28 w-full object-cover rounded-xl mb-3" />
                  <span className="text-[9px] text-gray-400 font-mono">{p.brand}</span>
                  <h4 
                    onClick={() => setRoute(`#/product/${p.slug}`)}
                    className="text-xs font-bold text-gray-800 hover:text-rose-500 cursor-pointer line-clamp-1 mt-0.5"
                  >
                    {p.name}
                  </h4>
                </div>
                <div className="border-t border-gray-50 pt-2.5 mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-rose-500 font-extrabold">Rp {p.lowestPrice.toLocaleString('id-ID')}</span>
                  <button onClick={() => setRoute(`#/product/${p.slug}`)} className="text-[10px] font-bold text-gray-900 hover:text-rose-500">Lihat</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
