import React, { useState } from "react";
import { Mail, CheckCircle, ShieldAlert, FileText, Globe, Rss, ArrowUp } from "lucide-react";

export default function Footer({ setRoute }: { setRoute: (route: string) => void }) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => {
      setIsSubscribed(false);
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-950 text-gray-400 font-sans mt-auto" id="main-footer">
      {/* Newsletter Widget */}
      <div className="border-b border-gray-900 bg-gray-900/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start space-x-3 max-w-md">
            <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400 mt-1">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">Ikuti Newsletter Promo & Cashback</h4>
              <p className="text-xs text-gray-500 mt-0.5">Dapatkan update deals terbaik, komparasi harga barang viral, dan review AI langsung ke inbox Anda.</p>
            </div>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              placeholder="Masukkan email aktif Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 px-4 rounded-xl border border-gray-800 bg-gray-950 text-xs text-gray-200 focus:outline-none focus:border-rose-500 transition"
            />
            <button
              type="submit"
              className="h-10 px-5 text-xs font-semibold bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-xl transition shrink-0 flex items-center space-x-1.5"
            >
              <span>Langganan</span>
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white font-bold text-base">
              A
            </div>
            <span className="font-sans text-sm font-bold tracking-tight text-white uppercase">
              AFILIASI<span className="text-rose-500">.ID</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Portal direktori, agregator harga cerdas, dan review produk berbasis AI terbesar di Indonesia. Kami mempermudah Anda mencari diskon terendah antar e-commerce terkemuka tanpa repot membandingkan satu per satu.
          </p>
          <div className="flex space-x-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> ID / IDN</span>
            <span className="flex items-center gap-1"><Rss className="h-3 w-3" /> RSS Feed Ready</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4">Kategori Utama</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => setRoute("#/search?category=gadget-handphone")} className="hover:text-white transition">Gadget & Handphone</button></li>
            <li><button onClick={() => setRoute("#/search?category=laptop-komputer")} className="hover:text-white transition">Laptop & Komputer</button></li>
            <li><button onClick={() => setRoute("#/search?category=olahraga-outdoor")} className="hover:text-white transition">Olahraga & Outdoor</button></li>
            <li><button onClick={() => setRoute("#/search?category=peralatan-rumah-tangga")} className="hover:text-white transition">Peralatan Rumah Tangga</button></li>
            <li><button onClick={() => setRoute("#/search?category=fashion-lifestyle")} className="hover:text-white transition">Fashion & Gaya Hidup</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4">Teknis & SEO</h4>
          <ul className="space-y-2 text-xs text-gray-500">
            <li className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> <span className="text-gray-400">sitemap.xml (Google Index ready)</span></li>
            <li className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> <span className="text-gray-400">robots.txt (SEO Optimised)</span></li>
            <li className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> <span className="text-gray-400">Schema JSON-LD (Rich snippets)</span></li>
            <li className="flex items-center gap-1.5"><FileText className="h-3 w-3" /> <span className="text-gray-400">PWA Manifest (Installable)</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4">Monetisasi & Disclaimer</h4>
          <div className="p-3.5 bg-gray-900 rounded-xl space-y-2.5">
            <div className="flex items-start space-x-2 text-[10px] leading-relaxed text-gray-500">
              <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p>
                <strong>AFILIASI.ID</strong> merupakan media promosi & perbandingan harga produk. Kami tidak menerima pembayaran langsung atau memproses transaksi.
              </p>
            </div>
            <div className="border-t border-gray-800 pt-2 flex flex-wrap gap-1 text-[9px] text-gray-400 font-mono">
              <span className="px-1.5 py-0.5 bg-gray-950 rounded">Shopee Affiliate</span>
              <span className="px-1.5 py-0.5 bg-gray-950 rounded">Tokopedia Affiliate</span>
              <span className="px-1.5 py-0.5 bg-gray-950 rounded">Lazada Affiliate</span>
              <span className="px-1.5 py-0.5 bg-gray-950 rounded">Google Adsense</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Compliance Frame */}
      <div className="border-t border-gray-900 py-6 bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-600 gap-4">
          <span>&copy; 2026 AFILIASI.ID. Hak cipta dilindungi undang-undang. Dibuat dengan cinta untuk Indonesia Tangguh.</span>
          <button 
            onClick={scrollToTop} 
            className="flex items-center space-x-1.5 px-3 py-1 bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-white rounded-lg transition"
            id="back-to-top"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Kembali Ke Atas</span>
          </button>
        </div>
      </div>

      {/* Subscription toast */}
      {isSubscribed && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-2xl bg-gray-900 p-4 shadow-2xl border border-gray-800 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <div>
            <h5 className="text-xs font-bold text-white">Pendaftaran Berhasil!</h5>
            <p className="text-[10px] text-gray-400">Selamat! Email Anda terdaftar dalam newsletter promo harian.</p>
          </div>
        </div>
      )}
    </footer>
  );
}
