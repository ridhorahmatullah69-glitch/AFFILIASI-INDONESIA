import React, { useState, useEffect } from "react";
import { 
  Filter, 
  RefreshCw, 
  Search, 
  Star, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sparkles,
  Award
} from "lucide-react";
import { Product, Category, Brand } from "../types.js";

interface SearchViewProps {
  initialQuery?: string;
  initialCategory?: string;
  setRoute: (route: string) => void;
  addToWishlist: (p: Product) => void;
  wishlist: Product[];
}

export default function SearchView({ initialQuery = "", initialCategory = "", setRoute, addToWishlist, wishlist }: SearchViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search/Filter states
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory || "all");
  const [brand, setBrand] = useState("all");
  const [marketplace, setMarketplace] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  const [cod, setCod] = useState(false);
  const [isOfficial, setIsOfficial] = useState(false);
  const [sort, setSort] = useState("popular");

  // Sync state with URL inputs
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setCategory(initialCategory || "all");
  }, [initialCategory]);

  // Fetch Categories and Brands
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(res => res.json()),
      fetch("/api/brands").then(res => res.json())
    ]).then(([cats, bnds]) => {
      setCategories(cats);
      setBrands(bnds);
    }).catch(err => console.error("Error loading filters data", err));
  }, []);

  // Fetch filtered products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.append("query", query.trim());
      if (category && category !== "all") params.append("category", category);
      if (brand && brand !== "all") params.append("brand", brand);
      if (marketplace && marketplace !== "all") params.append("marketplace", marketplace);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (inStock) params.append("inStock", "true");
      if (freeShipping) params.append("freeShipping", "true");
      if (cod) params.append("cod", "true");
      if (isOfficial) params.append("isOfficial", "true");
      if (sort) params.append("sort", sort);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Products filtering fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [query, category, brand, marketplace, minPrice, maxPrice, minRating, inStock, freeShipping, cod, isOfficial, sort]);

  const handleResetFilters = () => {
    setQuery("");
    setCategory("all");
    setBrand("all");
    setMarketplace("all");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setInStock(false);
    setFreeShipping(false);
    setCod(false);
    setIsOfficial(false);
    setSort("popular");
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchProducts();
    }
  };

  const marketplaceOptions = [
    { value: "all", label: "Semua Marketplace" },
    { value: "shopee", label: "Shopee Affiliate" },
    { value: "tokopedia", label: "Tokopedia" },
    { value: "tiktok shop", label: "TikTok Shop" },
    { value: "blibli", label: "Blibli" },
    { value: "lazada", label: "Lazada" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans" id="search-view-container">
      
      {/* Top Floating Search Accent */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Ketik kata kunci pencarian (contoh: ASUS ROG G14, Samsung S24, Sepatu Lari Specs)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-2.5">
          <label className="text-xs font-semibold text-gray-400 whitespace-nowrap">Urutkan:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 px-3 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-white focus:outline-none focus:border-rose-400 transition cursor-pointer"
          >
            <option value="popular">Produk Terpopuler</option>
            <option value="sales">Penjualan Terbanyak</option>
            <option value="price-asc">Harga Terendah</option>
            <option value="price-desc">Harga Tertinggi</option>
            <option value="rating">Rating Tertinggi</option>
            <option value="newest">Barang Terbaru</option>
          </select>
          <button
            onClick={handleResetFilters}
            className="h-10 px-3 text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition flex items-center space-x-1 shrink-0"
            title="Reset Semua Filter"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Filter Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs sticky top-24">
            <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
              <span className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-rose-500" /> Filter Pencarian
              </span>
              <span className="text-[10px] font-mono font-bold text-gray-400">{products.length} Temuan</span>
            </div>

            {/* Category Filter */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-bold text-gray-700">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-2 border border-gray-150 rounded-xl text-xs bg-white text-gray-700 focus:outline-none focus:border-rose-400"
              >
                <option value="all">Semua Kategori</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-bold text-gray-700">Merek / Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full h-9 px-2 border border-gray-150 rounded-xl text-xs bg-white text-gray-700 focus:outline-none focus:border-rose-400"
              >
                <option value="all">Semua Merek</option>
                {brands.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Marketplace Filter */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-bold text-gray-700">Tujuan Marketplace</label>
              <select
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
                className="w-full h-9 px-2 border border-gray-150 rounded-xl text-xs bg-white text-gray-700 focus:outline-none focus:border-rose-400"
              >
                {marketplaceOptions.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>

            {/* Price range filter */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-bold text-gray-700">Rentang Harga (Rp)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 h-9 px-2 border border-gray-150 rounded-xl text-xs placeholder:text-gray-400"
                />
                <span className="text-gray-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 h-9 px-2 border border-gray-150 rounded-xl text-xs placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-bold text-gray-700">Rating Pengguna</label>
              <div className="flex gap-1">
                {[0, 3, 4, 4.5].map(stars => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(stars)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                      minRating === stars
                        ? "border-rose-500 bg-rose-50 text-rose-600"
                        : "border-gray-150 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {stars === 0 ? "Semua" : `${stars}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist options */}
            <div className="space-y-2.5 border-t border-gray-50 pt-4 mt-4 text-xs text-gray-700">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="rounded border-gray-300 text-rose-500 focus:ring-rose-400 h-4 w-4"
                />
                <span className="font-semibold">Hanya Stok Tersedia</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freeShipping}
                  onChange={(e) => setFreeShipping(e.target.checked)}
                  className="rounded border-gray-300 text-rose-500 focus:ring-rose-400 h-4 w-4"
                />
                <span className="font-semibold flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5 text-emerald-500" /> Gratis Ongkir
                </span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cod}
                  onChange={(e) => setCod(e.target.checked)}
                  className="rounded border-gray-300 text-rose-500 focus:ring-rose-400 h-4 w-4"
                />
                <span className="font-semibold">Bisa Bayar di Tempat (COD)</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOfficial}
                  onChange={(e) => setIsOfficial(e.target.checked)}
                  className="rounded border-gray-300 text-rose-500 focus:ring-rose-400 h-4 w-4"
                />
                <span className="font-semibold flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-500" /> Mall / Official Store
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side Products Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            /* Skeleton Loading Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
                  <div className="aspect-square bg-gray-100 rounded-xl"></div>
                  <div className="h-3.5 bg-gray-150 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-150 rounded w-5/6"></div>
                  <div className="h-3.5 bg-gray-150 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const bestAff = product.affiliates.sort((a, b) => a.price - b.price)[0];
                const isInWishlist = wishlist.some(w => w.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="group bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Thumbnail wrapper */}
                      <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 mb-3 bg-gray-50">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-103 transition duration-500"
                        />
                        {product.isOfficial && (
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-blue-600 text-white text-[8px] font-bold rounded">
                            MALL
                          </span>
                        )}
                        {bestAff?.discount > 0 && (
                          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-bold rounded">
                            -{bestAff.discount}% OFF
                          </span>
                        )}
                      </div>

                      <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none">
                        {product.brand}
                      </span>
                      <h3
                        onClick={() => setRoute(`#/product/${product.slug}`)}
                        className="text-xs font-bold text-gray-900 hover:text-rose-500 transition cursor-pointer line-clamp-2 mt-1 min-h-[32px] leading-tight"
                      >
                        {product.name}
                      </h3>

                      {/* Score stars */}
                      <div className="flex items-center space-x-1 mt-1.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-gray-700">{product.rating}</span>
                        <span className="text-[9px] text-gray-400">({product.reviewCount} ulasan)</span>
                      </div>

                      {/* Price Tagging */}
                      <div className="mt-3.5 p-2 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-gray-400 leading-none">Mulai dari</span>
                          <span className="text-xs font-black text-rose-600 font-mono mt-0.5">
                            Rp {product.lowestPrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-gray-200 text-gray-700 rounded-lg shrink-0">
                          {product.affiliates.length} Opsi
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between gap-1">
                      <button
                        onClick={() => addToWishlist(product)}
                        className={`p-1.5 rounded-lg border transition ${
                          isInWishlist 
                            ? "bg-rose-50 border-rose-200 text-rose-500" 
                            : "bg-gray-50 border-gray-150 text-gray-400 hover:text-rose-500"
                        }`}
                        title={isInWishlist ? "Hapus dari wishlist" : "Simpan ke wishlist"}
                      >
                        <Star className={`h-3.5 w-3.5 ${isInWishlist ? "fill-rose-500" : ""}`} />
                      </button>
                      <button
                        onClick={() => setRoute(`#/product/${product.slug}`)}
                        className="flex-1 py-1.5 bg-gray-950 hover:bg-rose-500 hover:text-white transition text-white rounded-lg text-[10px] font-bold text-center"
                      >
                        Bandingkan Harga
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-2xs">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-sm font-bold text-gray-900">Tidak Menemukan Hasil</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">Gunakan kata kunci pencarian yang lebih umum atau kosongkan filter rentang harga Anda.</p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold transition hover:bg-rose-500"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
