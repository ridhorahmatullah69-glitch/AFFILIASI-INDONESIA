import React from "react";
import { X, GitCompare, ExternalLink, Star, CheckCircle, AlertCircle } from "lucide-react";
import { Product } from "../types.js";

interface CompareViewProps {
  compareList: Product[];
  removeFromCompare: (p: Product) => void;
  setRoute: (route: string) => void;
}

export default function CompareView({ compareList, removeFromCompare, setRoute }: CompareViewProps) {
  if (compareList.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center font-sans">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 mx-auto mb-4">
          <GitCompare className="h-6 w-6" />
        </div>
        <h2 className="text-sm font-bold text-gray-900">Belum Ada Produk yang Dibandingkan</h2>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          Cari produk di marketplace kami dan klik tombol &quot;Bandingkan&quot; untuk menyandingkan spesifikasi produk hingga 4 barang sekaligus.
        </p>
        <button onClick={() => setRoute("#/search")} className="mt-4 px-4 py-2 bg-gray-900 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition">
          Mulai Cari Produk
        </button>
      </div>
    );
  }

  // Gather all unique spec keys from compared products
  const allSpecKeys = Array.from(
    new Set(compareList.flatMap(p => Object.keys(p.specs || {})))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans" id="compare-matrix-view">
      <div className="flex items-center space-x-2.5 mb-6">
        <GitCompare className="h-5 w-5 text-rose-500" />
        <div>
          <h1 className="text-base font-bold text-gray-900">Matrix Perbandingan Spesifikasi Produk ({compareList.length}/4)</h1>
          <p className="text-xs text-gray-500">Analisis komparasi mendalam secara objektif sebelum Anda membeli</p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-150 rounded-2xl shadow-2xs">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-gray-150 bg-gray-50/50">
              <th className="p-4 font-bold text-gray-400 uppercase tracking-wider w-48 shrink-0">Item Komparasi</th>
              {compareList.map((product) => (
                <th key={product.id} className="p-4 align-top relative border-l border-gray-150">
                  <button
                    onClick={() => removeFromCompare(product)}
                    className="absolute top-3 right-3 p-1.5 bg-gray-50 hover:bg-rose-100 hover:text-rose-500 rounded-full transition"
                    title="Hapus"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <img src={product.images[0]} alt={product.name} className="h-20 w-20 object-cover rounded-xl border border-gray-100 mb-3" />
                  <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest leading-none">{product.brand}</span>
                  <h4 
                    onClick={() => setRoute(`#/product/${product.slug}`)}
                    className="text-xs font-bold text-gray-900 hover:text-rose-500 transition cursor-pointer mt-1 line-clamp-2 min-h-[32px] leading-tight"
                  >
                    {product.name}
                  </h4>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price Row */}
            <tr className="border-b border-gray-150">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/20">Mulai Harga Termurah</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 font-mono font-black text-rose-600 border-l border-gray-150">
                  Rp {p.lowestPrice.toLocaleString('id-ID')}
                </td>
              ))}
            </tr>

            {/* Rating Row */}
            <tr className="border-b border-gray-150">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/20">Rating Pembeli</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 border-l border-gray-150">
                  <div className="flex items-center space-x-1 font-semibold text-gray-700">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{p.rating}</span>
                    <span className="text-[10px] text-gray-400">({p.reviewCount})</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Pros list */}
            <tr className="border-b border-gray-150">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/20">Kelebihan Utama</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 border-l border-gray-150 align-top">
                  <ul className="space-y-1 text-[11px] text-emerald-800 list-disc list-inside">
                    {p.pros.slice(0, 3).map((pro, i) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Cons list */}
            <tr className="border-b border-gray-150">
              <td className="p-4 font-bold text-gray-700 bg-gray-50/20">Kekurangan</td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 border-l border-gray-150 align-top">
                  <ul className="space-y-1 text-[11px] text-rose-800 list-disc list-inside">
                    {p.cons.slice(0, 3).map((con, i) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            {/* Specifications list */}
            {allSpecKeys.map((key) => (
              <tr key={key} className="border-b border-gray-150">
                <td className="p-4 font-bold text-gray-700 bg-gray-50/20 capitalize">{key}</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 border-l border-gray-150 text-gray-500">
                    {p.specs[key] || <span className="text-gray-300">-</span>}
                  </td>
                ))}
              </tr>
            ))}

            {/* Call to action Row */}
            <tr>
              <td className="p-4 bg-gray-50/20"></td>
              {compareList.map((p) => (
                <td key={p.id} className="p-4 border-l border-gray-150">
                  <button
                    onClick={() => setRoute(`#/product/${p.slug}`)}
                    className="w-full py-2 bg-gray-900 hover:bg-rose-500 hover:text-white text-white text-[11px] font-bold rounded-xl transition flex items-center justify-center space-x-1"
                  >
                    <span>Bandingkan Harga</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
