import React, { useState, useEffect } from "react";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import HomeView from "./components/HomeView.js";
import SearchView from "./components/SearchView.js";
import ProductDetailView from "./components/ProductDetailView.js";
import BlogView from "./components/BlogView.js";
import ArticleDetailView from "./components/ArticleDetailView.js";
import ProgrammaticDetailView from "./components/ProgrammaticDetailView.js";
import CompareView from "./components/CompareView.js";
import WishlistView from "./components/WishlistView.js";
import AdminPanel from "./components/AdminPanel.js";
import { Product } from "./types.js";

export default function App() {
  const [route, setRoute] = useState("");
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Parse hash routing on mount and changes
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || "#/");
    };
    
    // Set initial route
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Sync route updater helper
  const navigateTo = (newHash: string) => {
    window.location.hash = newHash;
    setRoute(newHash);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load wishlist & compare lists from localStorage
  useEffect(() => {
    const storedWish = localStorage.getItem("wishlist");
    if (storedWish) {
      try {
        setWishlist(JSON.parse(storedWish));
      } catch (e) {
        console.error(e);
      }
    }

    const storedCompare = localStorage.getItem("compareList");
    if (storedCompare) {
      try {
        setCompareList(JSON.parse(storedCompare));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      let updated;
      if (prev.some((p) => p.id === product.id)) {
        // Remove if already exists (toggle)
        updated = prev.filter((p) => p.id !== product.id);
      } else {
        updated = [...prev, product];
      }
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWishlist = (product: Product) => {
    setWishlist((prev) => {
      const updated = prev.filter((p) => p.id !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const addToCompare = (product: Product) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        alert("Produk ini sudah ada di daftar pembanding!");
        return prev;
      }
      if (prev.length >= 4) {
        alert("Batas maksimal pembandingan adalah 4 produk sekaligus!");
        return prev;
      }
      const updated = [...prev, product];
      localStorage.setItem("compareList", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCompare = (product: Product) => {
    setCompareList((prev) => {
      const updated = prev.filter((p) => p.id !== product.id);
      localStorage.setItem("compareList", JSON.stringify(updated));
      return updated;
    });
  };

  // Route Parser / Matcher
  const renderView = () => {
    const current = route || "#/";

    if (current === "#/" || current === "#") {
      return (
        <HomeView
          setRoute={navigateTo}
          addToWishlist={addToWishlist}
          wishlist={wishlist}
          addToCompare={addToCompare}
          compareList={compareList}
        />
      );
    }

    if (current.startsWith("#/search")) {
      // Parse category and query params from hash
      const urlObj = new URL(current.replace("#", "http://temp.com"));
      const catParam = urlObj.searchParams.get("category") || "";
      const qParam = urlObj.searchParams.get("query") || "";

      return (
        <SearchView
          initialQuery={qParam}
          initialCategory={catParam}
          setRoute={navigateTo}
          addToWishlist={addToWishlist}
          wishlist={wishlist}
        />
      );
    }

    if (current.startsWith("#/product/")) {
      const slug = current.replace("#/product/", "");
      return (
        <ProductDetailView
          slug={slug}
          setRoute={navigateTo}
          addToWishlist={addToWishlist}
          wishlist={wishlist}
          addToCompare={addToCompare}
          compareList={compareList}
        />
      );
    }

    if (current.startsWith("#/blog/")) {
      const slug = current.replace("#/blog/", "");
      return <ArticleDetailView slug={slug} setRoute={navigateTo} />;
    }

    if (current === "#/blog") {
      return <BlogView setRoute={navigateTo} />;
    }

    if (current.startsWith("#/p/")) {
      const slug = current.replace("#/p/", "");
      return <ProgrammaticDetailView slug={slug} setRoute={navigateTo} />;
    }

    if (current === "#/compare") {
      return (
        <CompareView
          compareList={compareList}
          removeFromCompare={removeFromCompare}
          setRoute={navigateTo}
        />
      );
    }

    if (current === "#/wishlist") {
      return (
        <WishlistView
          wishlist={wishlist}
          removeFromWishlist={removeFromWishlist}
          setRoute={navigateTo}
        />
      );
    }

    if (current === "#/admin") {
      return <AdminPanel setRoute={navigateTo} />;
    }

    // Default Fallback
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center font-sans">
        <h2 className="text-xl font-bold text-gray-900">404 - Halaman Tidak Ditemukan</h2>
        <p className="text-xs text-gray-400 mt-2">Halaman yang Anda tuju di portal Afiliasi tidak tersedia.</p>
        <button onClick={() => navigateTo("#/")} className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold transition">
          Kembali ke Beranda
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col selection:bg-rose-500 selection:text-white antialiased">
      {/* Dynamic Navigation Header */}
      <Header
        currentRoute={route}
        setRoute={navigateTo}
        wishlistCount={wishlist.length}
        compareCount={compareList.length}
      />

      {/* Main viewport frame */}
      <main className="flex-1">
        {renderView()}
      </main>

      {/* Polished Site Footer */}
      <Footer setRoute={navigateTo} />
    </div>
  );
}
