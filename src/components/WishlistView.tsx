import React from "react";
import { Star, Trash2, Sliders, ShoppingCart } from "lucide-react";
import { Product } from "../types.js";

interface WishlistViewProps {
  wishlist: Product[];
  removeFromWishlist: (p: Product) => void;
  setRoute: (route: string) => void;
}

export default function WishlistView({ wishlist, removeFromWishlist, setRoute }: WishlistViewProps) {
  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center font-sans">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mx-auto mb-4">
          <Star className="h-6 w-6" />
        </div>
        <h2 className="text-sm font-bold text-gray-900">Wishlist & Bookmark Anda Kosong</h2>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          Simpan produk viral atau promo impian Anda ke dalam Wishlist agar bisa dengan mudah memantau pergerakan harga tanpa kehilangan jejak.
        </p>
        <button onClick={() => setRoute("#/search")} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold transition">
          Mulai Cari Produk
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans" id="wishlist-view">
      <div className="flex items-center space-x-2.5 mb-6">
        <Star className="h-5 w-5 text-rose-500 fill-rose-500" />
        <div>
          <h1 className="text-base font-bold text-gray-900">Produk Wishlist Saya ({wishlist.length})</h1>
          <p className="text-xs text-gray-500">Lacak harga termurah untuk semua barang pilihan Anda</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          const bestAff = product.affiliates.sort((a, b) => a.price - b.price)[0];
          return (
            <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-2xs hover:shadow-lg transition duration-250 flex flex-col justify-between">
              <div>
                <img src={product.images[0]} alt={product.name} className="h-40 w-full object-cover rounded-xl border border-gray-100 mb-3" />
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{product.brand}</span>
                <h3 
                  onClick={() => setRoute(`#/product/${product.slug}`)}
                  className="text-xs font-bold text-gray-900 hover:text-rose-500 transition cursor-pointer line-clamp-2 mt-1 min-h-[32px]"
                >
                  {product.name}
                </h3>
                <div className="text-xs font-black text-rose-600 mt-2 font-mono">Rp {product.lowestPrice.toLocaleString('id-ID')}</div>
              </div>

              <div className="border-t border-gray-100 pt-3 mt-4 flex items-center justify-between">
                <button
                  onClick={() => removeFromWishlist(product)}
                  className="p-1.5 text-gray-400 hover:text-rose-500 transition hover:bg-rose-50 rounded-lg"
                  title="Hapus dari wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setRoute(`#/product/${product.slug}`)}
                  className="px-3.5 py-1.5 bg-gray-900 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold transition"
                >
                  Bandingkan Harga
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
