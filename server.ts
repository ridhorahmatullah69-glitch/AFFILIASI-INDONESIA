import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { 
  Product, 
  Category, 
  Brand, 
  BlogArticle, 
  ProgrammaticPage, 
  ClickAnalytic, 
  SearchAnalytic, 
  PriceAlert, 
  CronLog, 
  AffiliateLink,
  PriceHistory
} from "./src/types.js";

dotenv.config();

const __filename_resolved = typeof __filename !== "undefined" ? __filename : "";
const __dirname_resolved = typeof __dirname !== "undefined" ? __dirname : process.cwd();

const PORT = 3000;
const DATABASE_FILE = path.join(process.cwd(), "database.json");

// --- INITIAL SEED DATA ---
const defaultCategories: Category[] = [
  { id: "cat-1", name: "Gadget & Handphone", slug: "gadget-handphone", iconName: "Smartphone", description: "Review dan perbandingan harga smartphone terbaru, tablet, dan aksesoris gadget terkini." },
  { id: "cat-2", name: "Laptop & Komputer", slug: "laptop-komputer", iconName: "Laptop", description: "Rekomendasi laptop gaming, ultrabook premium, komputer rakitan, dan aksesoris IT terbaik." },
  { id: "cat-3", name: "Olahraga & Outdoor", slug: "olahraga-outdoor", iconName: "Dumbbell", description: "Peralatan petualangan, hiking, sepatu lari, futsal, jersey olahraga, dan gear fitness." },
  { id: "cat-4", name: "Peralatan Rumah Tangga", slug: "peralatan-rumah-tangga", iconName: "Home", description: "Elektronik dapur, mesin cuci, kulkas, AC, printer rumah, smart home device, dan perabotan modern." },
  { id: "cat-5", name: "Fashion & Gaya Hidup", slug: "fashion-lifestyle", iconName: "Shirt", description: "Tren busana lokal maupun global, sepatu sneakers, jaket outdoor, jam tangan, dan produk kecantikan." }
];

const defaultBrands: Brand[] = [
  { id: "brand-1", name: "ASUS", logo: "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=100&h=100&fit=crop&q=80", description: "Brand teknologi global terdepan dengan seri ROG, Zenbook, Vivobook, dan TUF Gaming." },
  { id: "brand-2", name: "Samsung", logo: "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=100&h=100&fit=crop&q=80", description: "Raksasa elektronik Korea Selatan dengan jajaran premium Galaxy, QLED TV, dan peralatan rumah pintar." },
  { id: "brand-3", name: "Canon", logo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop&q=80", description: "Spesialis pencitraan, kamera DSLR/Mirrorless, serta printer ink tank andalan rumah tangga." },
  { id: "brand-4", name: "Specs", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop&q=80", description: "Brand apparel dan sepatu olahraga lokal legendaris Indonesia dengan kualitas bersaing internasional." },
  { id: "brand-5", name: "Eiger", logo: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop&q=80", description: "Pioneer perlengkapan petualangan outdoor asli Bandung, sangat tangguh dan dicintai para pendaki gunung." },
  { id: "brand-6", name: "Xiaomi", logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop&q=80", description: "Brand andalan spesialis produk 'value for money' dengan ekosistem AIoT yang super lengkap." }
];

const defaultProducts: Product[] = [
  {
    id: "prod-1",
    name: "ASUS ROG Zephyrus G14 (2025)",
    slug: "asus-rog-zephyrus-g14-2025",
    brand: "ASUS",
    category: "laptop-komputer",
    description: "Laptop gaming 14 inci paling ringkas dan bertenaga di dunia. Dilengkapi layar ROG Nebula OLED 120Hz yang memukau, prosesor AMD Ryzen 9 terbaru, serta kartu grafis NVIDIA GeForce RTX 4060. Sasis aluminium unibody premium dengan ketebalan hanya 1.59cm membuatnya sangat mudah dibawa bepergian, menjadikannya pilihan utama gamer profesional, kreator konten, dan eksekutif muda.",
    specs: {
      "Prosesor": "AMD Ryzen 9 8945HS (8 Cores, 16 Threads, up to 5.2GHz)",
      "Kartu Grafis": "NVIDIA GeForce RTX 4060 Laptop GPU 8GB GDDR6",
      "Layar": "14-inch 3K (2880 x 1800) OLED, 120Hz, 100% DCI-P3, HDR",
      "Memori": "16GB LPDDR5X Dual Channel",
      "Penyimpanan": "1TB M.2 NVMe PCIe 4.0 SSD",
      "Baterai": "73Whrs, 100W USB-C Power Delivery charging",
      "Konektivitas": "Wi-Fi 6E, Bluetooth 5.3, USB4, HDMI 2.1",
      "Bobot": "1.50 kg"
    },
    pros: [
      "Layar OLED 3K 120Hz dengan akurasi warna sangat tinggi",
      "Desain super kompak, tipis, premium, dan kokoh (sasis aluminium CNC)",
      "Daya tahan baterai luar biasa untuk kategori laptop gaming",
      "Performa CPU dan GPU sangat seimbang untuk kerja berat maupun game AAA"
    ],
    cons: [
      "Kipas bersuara agak nyaring saat mode Turbo aktif",
      "RAM tersolder penuh, tidak bisa di-upgrade di masa mendatang",
      "Harga cukup tinggi untuk model dasar"
    ],
    rating: 4.8,
    reviewCount: 342,
    salesCount: 1250,
    images: [
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=400&fit=crop&q=80"
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isTrending: true,
    isViral: true,
    isPopular: true,
    isNew: true,
    isEditorChoice: true,
    aiSummary: "Laptop gaming idaman serbaguna yang menggabungkan portabilitas mutlak ultrabook premium dengan kekuatan grafis game modern. Sangat direkomendasikan bagi profesional kreatif dan gamer yang dinamis.",
    aiReview: "Berdasarkan analisis sentiment dan ulasan ratusan pengguna di berbagai e-commerce Indonesia, ASUS ROG Zephyrus G14 (2025) dinilai sebagai standar emas baru laptop gaming ringkas. Dominasi layar OLED 3K dengan contrast rasio menakjubkan 1.000.000:1 memberikan visual pengerjaan video dan gaming yang belum pernah ada sebelumnya. Walaupun kipasnya berisik di bawah beban kerja berat, rancangan thermal ROG Intelligent Cooling berhasil mencegah thermal throttling yang biasa menjangkiti sasis tipis.",
    faqs: [
      { question: "Apakah RAM ROG Zephyrus G14 2025 bisa di-upgrade?", answer: "Tidak, RAM pada model 2025 tersolder langsung di motherboard (on-board LPDDR5X) sehingga pastikan Anda memilih kapasitas yang sesuai (16GB atau 32GB) saat pembelian." },
      { question: "Berapa lama daya tahan baterai untuk penggunaan harian?", answer: "Untuk aktivitas ringan seperti browsing, pengetikan office, dan memutar video pada kecerahan 50%, baterai 73Whrs laptop ini dapat bertahan sekitar 7-9 jam." },
      { question: "Apakah charger bawaannya besar?", answer: "Laptop ini dibekali adapter bawaan ramping, namun juga mendukung pengisian daya praktis lewat port USB-C Power Delivery menggunakan charger GaN 100W." }
    ],
    colors: ["Eclipse Gray", "Platinum White"],
    sizes: ["14 Inci"],
    warranty: "2 Tahun Garansi Resmi ASUS Indonesia + 1 Tahun ASUS VIP Perfect Warranty",
    isOfficial: true,
    isMall: true,
    freeShipping: true,
    cod: false,
    lowestPrice: 28200000,
    highestPrice: 29100000,
    affiliates: [
      { id: "aff-1-tokopedia", platform: "Tokopedia", price: 28200000, originalPrice: 33500000, discount: 16, affiliateUrl: "https://www.tokopedia.com/search?q=rog+zephyrus+g14+2025", inStock: true, couponCode: "ASUSTOKO100K", rating: 4.9 },
      { id: "aff-1-shopee", platform: "Shopee", price: 28500000, originalPrice: 33500000, discount: 15, affiliateUrl: "https://shopee.co.id/search?keyword=rog+zephyrus+g14+2025", inStock: true, couponCode: "ASUSSHOPEE200", rating: 4.8 },
      { id: "aff-1-blibli", platform: "Blibli", price: 28900000, originalPrice: 33500000, discount: 13, affiliateUrl: "https://www.blibli.com/cari/rog+zephyrus+g14+2025", inStock: true, rating: 4.7 },
      { id: "aff-1-lazada", platform: "Lazada", price: 29100000, originalPrice: 33500000, discount: 13, affiliateUrl: "https://www.lazada.co.id/catalog/?q=rog+zephyrus+g14+2025", inStock: true, rating: 4.6 }
    ],
    priceHistory: [
      { date: "2026-01-01", Shopee: 29800000, Tokopedia: 29500000, Lazada: 30000000, Blibli: 29900000 },
      { date: "2026-02-01", Shopee: 29500000, Tokopedia: 29200000, Lazada: 29700000, Blibli: 29600000 },
      { date: "2026-03-01", Shopee: 29200000, Tokopedia: 28900000, Lazada: 29500000, Blibli: 29300000 },
      { date: "2026-04-01", Shopee: 28900000, Tokopedia: 28500000, Lazada: 29300000, Blibli: 29100000 },
      { date: "2026-05-01", Shopee: 28700000, Tokopedia: 28300000, Lazada: 29200000, Blibli: 29000000 },
      { date: "2026-06-01", Shopee: 28500000, Tokopedia: 28200000, Lazada: 29100000, Blibli: 28900000 }
    ]
  },
  {
    id: "prod-2",
    name: "Samsung Galaxy S24 Ultra AI (5G)",
    slug: "samsung-galaxy-s24-ultra-ai-5g",
    brand: "Samsung",
    category: "gadget-handphone",
    description: "Smartphone flagship tercanggih dengan integrasi kecerdasan buatan Galaxy AI yang revolusioner. Dibekali bodi titanium kelas luar angkasa yang super tangguh, pena stylus S-Pen bawaan, prosesor Snapdragon 8 Gen 3 for Galaxy yang ultra kencang, serta sistem kamera quad legendaris dengan lensa utama 200MP dan zoom optikal 5x super jernih dalam pencahayaan redup berkat sensor Nightography yang diperluas.",
    specs: {
      "Prosesor": "Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)",
      "Memori": "12GB LPDDR5X",
      "Penyimpanan": "256GB / 512GB / 1TB UFS 4.0",
      "Layar": "6.8-inch Dynamic AMOLED 2X, QHD+, 1-120Hz, Gorilla Armor anti-refleksi",
      "Kamera Belakang": "200MP Utama (OIS) + 50MP Periscope (5x Zoom) + 10MP Telephoto (3x Zoom) + 12MP Ultrawide",
      "Kamera Depan": "12MP Dual Pixel Dual Video",
      "Baterai": "5000mAh, Fast Charging 45W, Wireless Charging 15W",
      "Keamanan": "Ultrasonic Fingerprint, Samsung Knox Vault, IP68 Debu & Air"
    },
    pros: [
      "Fitur kecerdasan buatan Galaxy AI (Circle to Search, Live Translate, Notes Assist)",
      "Layar berlapis Gorilla Armor yang secara masif mengurangi pantulan cahaya hingga 75%",
      "Sasis Titanium memberikan durabilitas ekstra dan rasa genggam yang kokoh",
      "Sistem kamera zoom 5x optik dengan sensor 50MP sangat tajam malam hari",
      "Garansi pembaruan sistem operasi dan patch keamanan penuh selama 7 tahun"
    ],
    cons: [
      "Ukuran bodi bongsor dan bobot berat (232g), kurang ramah kantong pakaian",
      "Harga sangat mahal di kelas smartphone",
      "Tidak disertai kepala charger (adapter) dalam kotak penjualan"
    ],
    rating: 4.9,
    reviewCount: 521,
    salesCount: 3100,
    images: [
      "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=400&fit=crop&q=80"
    ],
    isTrending: true,
    isViral: true,
    isPopular: true,
    isNew: false,
    isEditorChoice: true,
    aiSummary: "Smartphone terbaik tanpa kompromi bagi penikmat produktivitas tinggi, fotografer mobile, dan mereka yang ingin merasakan masa depan teknologi mobile AI secara instan.",
    aiReview: "Penerimaan Samsung Galaxy S24 Ultra di pasar Indonesia sangat luar biasa positif, khususnya dari segmen pebisnis dan pembuat konten. Fitur Live Translate terbukti sangat berguna untuk menunjang komunikasi internasional harian secara real-time. Lapisan anti-pantulan Gorilla Armor diakui media lokal sebagai fitur game-changer yang membuat layar AMOLED-nya tetap nyaman digunakan langsung di bawah terik matahari khatulistiwa.",
    faqs: [
      { question: "Apakah Galaxy S24 Ultra mendukung eSIM?", answer: "Ya, smartphone ini mendukung Dual SIM fisik ditambah dengan eSIM yang bisa aktif secara bersamaan." },
      { question: "Apakah fitur Galaxy AI gratis selamanya?", answer: "Samsung menyatakan fitur Galaxy AI akan disediakan gratis setidaknya hingga akhir tahun 2025 di perangkat yang didukung." },
      { question: "Apakah bisa merekam video beresolusi 8K?", answer: "Tentu, Anda bisa merekam video resolusi ultra tinggi 8K pada 30fps menggunakan kamera utama 200MP maupun lensa zoom 50MP." }
    ],
    colors: ["Titanium Gray", "Titanium Yellow", "Titanium Violet", "Titanium Black"],
    sizes: ["256GB", "512GB", "1TB"],
    warranty: "1 Tahun Garansi Resmi SEIN (Samsung Electronics Indonesia)",
    isOfficial: true,
    isMall: true,
    freeShipping: true,
    cod: true,
    lowestPrice: 19399000,
    highestPrice: 19700000,
    affiliates: [
      { id: "aff-2-tiktok", platform: "TikTok Shop", price: 19399000, originalPrice: 21999000, discount: 11, affiliateUrl: "https://www.tiktok.com/search?q=samsung+s24+ultra", inStock: true, couponCode: "TIKTOKAI500", rating: 4.9 },
      { id: "aff-2-tokopedia", platform: "Tokopedia", price: 19499000, originalPrice: 21999000, discount: 11, affiliateUrl: "https://www.tokopedia.com/search?q=samsung+s24+ultra", inStock: true, couponCode: "SEINTOKO300", rating: 4.9 },
      { id: "aff-2-shopee", platform: "Shopee", price: 19599000, originalPrice: 21999000, discount: 10, affiliateUrl: "https://shopee.co.id/search?keyword=samsung+s24+ultra", inStock: true, rating: 4.8 },
      { id: "aff-2-lazada", platform: "Lazada", price: 19700000, originalPrice: 21999000, discount: 10, affiliateUrl: "https://www.lazada.co.id/catalog/?q=samsung+s24+ultra", inStock: true, rating: 4.7 }
    ],
    priceHistory: [
      { date: "2026-01-01", "TikTok Shop": 20500000, Tokopedia: 20400000, Shopee: 20600000, Lazada: 20700000 },
      { date: "2026-02-01", "TikTok Shop": 20200000, Tokopedia: 20100000, Shopee: 20300000, Lazada: 20400000 },
      { date: "2026-03-01", "TikTok Shop": 19999000, Tokopedia: 19899000, Shopee: 20000000, Lazada: 20100000 },
      { date: "2026-04-01", "TikTok Shop": 19699000, Tokopedia: 19700000, Shopee: 19800000, Lazada: 19900000 },
      { date: "2026-05-01", "TikTok Shop": 19499000, Tokopedia: 19550000, Shopee: 19650000, Lazada: 19800000 },
      { date: "2026-06-01", "TikTok Shop": 19399000, Tokopedia: 19499000, Shopee: 19599000, Lazada: 19700000 }
    ]
  },
  {
    id: "prod-3",
    name: "Specs Lightspeed Reborn Lari / Futsal",
    slug: "specs-lightspeed-reborn",
    brand: "Specs",
    category: "olahraga-outdoor",
    description: "Kebangkitan seri sepatu sepakbola, futsal, dan lari paling legendaris dari brand lokal terbesar Indonesia Specs. Menggunakan teknologi upper tipis microfiber sintetis yang super lentur dan ultra-ringan memberikan kontrol bola presisi serta kecepatan lari maksimal. Dirancang khusus untuk kontur kaki masyarakat Asia Tenggara yang cenderung lebar, menawarkan kenyamanan terbaik tanpa menyebabkan lecet pada tumit atau jari kaki.",
    specs: {
      "Upper": "Microfiber Sintetis berkualitas tinggi dengan cetakan grafis dinamis",
      "Insole": "Moulded EVA sockliner empuk penyerap benturan",
      "Outsole": "Pebax carbon plate kaku dengan rancangan stud akselerasi tinggi",
      "Berat": "178 gram (Sangat Ringan)",
      "Jenis Lapangan": "Futsal / Lapangan Rumput Sintetis / Lapangan Semen (IN & FG)",
      "Teknologi": "Speedarc Frame, X-Trecs Studs"
    },
    pros: [
      "Bobot sepatu ultra-ringan meningkatkan kelincahan bermanuver",
      "Kualitas bahan dan jahitan kokoh setara brand global ratusan ribu rupiah",
      "Dirancang khusus untuk anatomi kaki lebar Indonesia (Wide-fit)",
      "Harga sangat bersahabat bagi pelajar dan atlet amatir"
    ],
    cons: [
      "Bagian upper tipis kurang memproteksi kaki jika terinjak pemain lain",
      "Stok warna edisi terbatas sering cepat habis di pasaran"
    ],
    rating: 4.7,
    reviewCount: 890,
    salesCount: 8400,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=400&fit=crop&q=80"
    ],
    isTrending: false,
    isViral: true,
    isPopular: true,
    isNew: false,
    isEditorChoice: false,
    aiSummary: "Sepatu olahraga lokal berkinerja tinggi yang memecahkan rekor bobot teringan. Ideal untuk pemain agresif yang mementingkan kelincahan, akselerasi cepat, serta anggaran ekonomis.",
    aiReview: "Specs Lightspeed Reborn diakui komunitas futsal tanah air sebagai fenomena tersendiri. Ribuan pembeli sepakat bahwa sepatu ini menepis stigma produk lokal berkualitas rendah. Outsole Pebax yang lentur memberikan daya pegas elastisitas yang luar biasa saat melakukan sprint pendek di lapangan kayu maupun sintetis.",
    faqs: [
      { question: "Apakah ukuran sepatu Specs sama dengan Nike/Adidas?", answer: "Ukuran Specs cenderung pas (true to size) untuk kaki orang Indonesia, namun jika kaki Anda sangat lebar, disarankan naik 1 size dari biasanya." },
      { question: "Apakah tipe IN cocok untuk lapangan semen keras?", answer: "Ya, varian IN (Indoor) dibekali rubber outsole non-marking berkualitas tinggi yang memiliki traksi kuat di lapangan semen, kayu, maupun interlock." }
    ],
    colors: ["Red Neon", "Electric Yellow", "Ocean Blue", "White Gold"],
    sizes: ["39", "40", "41", "42", "43", "44"],
    warranty: "Garansi Tukar Ukuran 3 Hari Toko Resmi",
    isOfficial: true,
    isMall: false,
    freeShipping: true,
    cod: true,
    lowestPrice: 445000,
    highestPrice: 460000,
    affiliates: [
      { id: "aff-3-tokopedia", platform: "Tokopedia", price: 445000, originalPrice: 599000, discount: 26, affiliateUrl: "https://www.tokopedia.com/search?q=specs+lightspeed+reborn", inStock: true, rating: 4.8 },
      { id: "aff-3-shopee", platform: "Shopee", price: 450000, originalPrice: 599000, discount: 25, affiliateUrl: "https://shopee.co.id/search?keyword=specs+lightspeed+reborn", inStock: true, couponCode: "SPECSLOKAL5", rating: 4.7 },
      { id: "aff-3-lazada", platform: "Lazada", price: 460000, originalPrice: 599000, discount: 23, affiliateUrl: "https://www.lazada.co.id/catalog/?q=specs+lightspeed+reborn", inStock: true, rating: 4.5 }
    ],
    priceHistory: [
      { date: "2026-01-01", Tokopedia: 520000, Shopee: 530000, Lazada: 540000 },
      { date: "2026-02-01", Tokopedia: 499000, Shopee: 510000, Lazada: 520000 },
      { date: "2026-03-01", Tokopedia: 480000, Shopee: 490000, Lazada: 500000 },
      { date: "2026-04-01", Tokopedia: 465000, Shopee: 470000, Lazada: 480000 },
      { date: "2026-05-01", Tokopedia: 450000, Shopee: 460000, Lazada: 470000 },
      { date: "2026-06-01", Tokopedia: 445000, Shopee: 450000, Lazada: 460000 }
    ]
  },
  {
    id: "prod-4",
    name: "Canon PIXMA G3010 Wireless Ink Tank",
    slug: "canon-pixma-g3010-wireless-ink-tank",
    brand: "Canon",
    category: "peralatan-rumah-tangga",
    description: "Printer nirkabel tangki tinta (ink tank) isi ulang berkapasitas tinggi, didesain untuk pencetakan bervolume tinggi dengan biaya operasional yang sangat ekonomis. printer multi-fungsi ini mengintegrasikan fungsi Print, Scan, dan Copy yang bisa dioperasikan langsung dari ponsel Anda lewat jaringan Wi-Fi lokal menggunakan aplikasi Canon PRINT Inkjet/SELPHY. Sangat andal untuk kebutuhan tugas anak sekolah, mahasiswa, kantor kecil (SOHO), serta bisnis percetakan mini.",
    specs: {
      "Fungsi": "Print, Scan, Copy (All-in-One)",
      "Sistem Tinta": "Tangki Tinta Botol Terintegrasi (GI-790 PGBK, C, M, Y)",
      "Kecepatan Cetak": "8.8 ipm (Hitam) / 5.0 ipm (Warna)",
      "Konektivitas": "Wi-Fi, USB 2.0 High Speed",
      "Resolusi Cetak": "4800 x 1200 dpi",
      "Kapasitas Kertas": "A4, A5, B5, LTR, LGL, Borderless Photo 4x6 inci",
      "Tipe Layar": "LCD 1.2 inci Segment Mono"
    },
    pros: [
      "Biaya cetak per lembar sangat murah (satu botol tinta hitam mencetak hingga 6000 lembar)",
      "Pengisian tinta sangat mudah, botol berdesain anti tumpah dengan warna penutup berbeda",
      "Dukungan cetak foto borderless (tanpa tepi putih) beresolusi tinggi",
      "Kemudahan operasional nirkabel langsung dari smartphone tanpa PC"
    ],
    cons: [
      "Setup Wi-Fi awal membutuhkan ketelitian ekstra",
      "Kecepatan cetak standar, tidak secepat printer laser"
    ],
    rating: 4.6,
    reviewCount: 312,
    salesCount: 1980,
    images: [
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&h=400&fit=crop&q=80"
    ],
    isTrending: true,
    isViral: false,
    isPopular: true,
    isNew: false,
    isEditorChoice: false,
    aiSummary: "Printer All-In-One wireless ink tank paling awet dan andal di kelasnya, membebaskan Anda dari kecemasan kehabisan kartrid tinta berharga mahal di tengah-tengah tugas malam hari.",
    aiReview: "Ulasan printer Canon PIXMA G3010 di kalangan pengguna kantor mikro Indonesia menunjukkan tingkat kepuasan tinggi pada daya tahan print head. Tinta pigmen hitam GI-790 menghasilkan teks hitam yang sangat tajam dan tahan cipratan air, yang mana sangat penting untuk cetakan dokumen legal dan invoice pengiriman logistik.",
    faqs: [
      { question: "Apakah printer ini bisa mencetak langsung dari iPhone tanpa Wi-Fi router?", answer: "Ya, printer ini mendukung mode Wireless Direct Connection yang memungkinkan perangkat Anda terhubung langsung ke printer tanpa perantara router." },
      { question: "Apakah tinta botol GI-790 mudah didapatkan di Indonesia?", answer: "Sangat mudah. Tinta GI-790 merupakan salah satu tinta printer isi ulang orisinal terlaris dan tersedia di hampir seluruh toko komputer fisik maupun online di Indonesia." }
    ],
    colors: ["Black"],
    sizes: ["All-in-One"],
    warranty: "3 Tahun Garansi Resmi Canon Indonesia (termasuk Print Head & Ink Tank)",
    isOfficial: true,
    isMall: true,
    freeShipping: true,
    cod: true,
    lowestPrice: 1840000,
    highestPrice: 1899000,
    affiliates: [
      { id: "aff-4-shopee", platform: "Shopee", price: 1840000, originalPrice: 2499000, discount: 26, affiliateUrl: "https://shopee.co.id/search?keyword=canon+g3010", inStock: true, rating: 4.7 },
      { id: "aff-4-tokopedia", platform: "Tokopedia", price: 1850000, originalPrice: 2499000, discount: 25, affiliateUrl: "https://www.tokopedia.com/search?q=canon+g3010", inStock: true, couponCode: "CANONPRINT50", rating: 4.6 },
      { id: "aff-4-blibli", platform: "Blibli", price: 1899000, originalPrice: 2499000, discount: 24, affiliateUrl: "https://www.blibli.com/cari/canon+g3010", inStock: true, rating: 4.5 }
    ],
    priceHistory: [
      { date: "2026-01-01", Shopee: 1980000, Tokopedia: 1990000, Blibli: 2020000 },
      { date: "2026-02-01", Shopee: 1950000, Tokopedia: 1960000, Blibli: 1980000 },
      { date: "2026-03-01", Shopee: 1920000, Tokopedia: 1925000, Blibli: 1950000 },
      { date: "2026-04-01", Shopee: 1890000, Tokopedia: 1900000, Blibli: 1920000 },
      { date: "2026-05-01", Shopee: 1860000, Tokopedia: 1870000, Blibli: 1910000 },
      { date: "2026-06-01", Shopee: 1840000, Tokopedia: 1850000, Blibli: 1899000 }
    ]
  },
  {
    id: "prod-5",
    name: "Eiger Wanderlust Backpack 60L Carrier",
    slug: "eiger-wanderlust-backpack-60l-carrier",
    brand: "Eiger",
    category: "olahraga-outdoor",
    description: "Tas ransel gunung/carrier berkapasitas 60 liter yang dirancang untuk ekspedisi pendakian jarak menengah hingga jauh selama 3-5 hari. Menggunakan bahan Nylon Cordura yang terkenal sangat tangguh dan anti sobek. Dilengkapi dengan teknologi teknologi penyangga punggung (backsystem) Ergocomfort yang revolusioner, yang memindahkan distribusi beban tas secara merata dari bahu menuju panggul, meminimalkan kelelahan otot punggung pendaki.",
    specs: {
      "Kapasitas": "60 Liter",
      "Material": "Nylon Cordura 500D, Polyester 400D",
      "Sistem Punggung": "Ergocomfort Backsystem with Adjustable Torso length",
      "Dimensi": "78 x 32 x 26 cm",
      "Bobot Kosong": "2.2 kg",
      "Kelengkapan": "Rain Cover (Pelindung Hujan Waterproof), Trekking pole holder, Bottom compartment access"
    },
    pros: [
      "Konstruksi material Cordura legendaris Eiger yang anti sobek dan sangat awet bertahun-tahun",
      "Ergocomfort backsystem sangat empuk dengan sirkulasi udara jaring yang adem",
      "Torso tas bisa diatur naik-turun menyesuaikan panjang punggung masing-masing pengguna",
      "Akses kompartemen bawah mempermudah mengambil sleeping bag tanpa bongkar isi atas"
    ],
    cons: [
      "Bobot kosong tas (2.2kg) sedikit lebih berat dibanding tas tipe ultralight murni",
      "Pilihan kombinasi warna cenderung kalem dan taktis, kurang variasi warna terang"
    ],
    rating: 4.8,
    reviewCount: 228,
    salesCount: 1450,
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=400&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop&q=80"
    ],
    isTrending: false,
    isViral: false,
    isPopular: true,
    isNew: false,
    isEditorChoice: true,
    aiSummary: "Tas gunung andalan pendaki sejati. Durabilitas ekstrem, garansi panjang, dan kenyamanan backsystem ergonomis menjadikannya salah satu investasi perlengkapan naik gunung terbaik Anda.",
    aiReview: "Eiger Wanderlust 60L mendapat apresiasi sangat tinggi dari komunitas pencinta alam Mapala maupun pendaki solo di Indonesia. Sistem sabuk pinggul yang ekstra tebal dilapisi foam empuk menyerap beban berat dengan sangat baik, membuat pendakian gunung ekstrem seperti Semeru atau Rinjani terasa jauh lebih nyaman.",
    faqs: [
      { question: "Apakah carrier Eiger Wanderlust ini mendapat kartu garansi?", answer: "Ya, seluruh produk tas orisinal Eiger mendapatkan garansi perbaikan ritsleting dan jahitan selama 1 tahun di seluruh Eiger Adventure Store se-Indonesia." },
      { question: "Apakah tas ini muat dimasukkan ke kabin pesawat?", answer: "Untuk kapasitas 60L dengan frame besi aktif, tas ini harus masuk ke bagasi pesawat dan tidak diizinkan masuk kabin demi keselamatan penerbangan." }
    ],
    colors: ["Olive Green", "Tactical Black", "Navy Blue"],
    sizes: ["60L"],
    warranty: "1 Tahun Garansi Resmi Eiger Indonesia untuk Jahitan dan Ritsleting",
    isOfficial: true,
    isMall: false,
    freeShipping: false,
    cod: true,
    lowestPrice: 1220000,
    highestPrice: 1250000,
    affiliates: [
      { id: "aff-5-tokopedia", platform: "Tokopedia", price: 1220000, originalPrice: 1599000, discount: 23, affiliateUrl: "https://www.tokopedia.com/search?q=eiger+wanderlust+60l", inStock: true, rating: 4.8 },
      { id: "aff-5-shopee", platform: "Shopee", price: 1250000, originalPrice: 1599000, discount: 21, affiliateUrl: "https://shopee.co.id/search?keyword=eiger+wanderlust+60l", inStock: true, couponCode: "EIGEROUTDOOR10", rating: 4.7 }
    ],
    priceHistory: [
      { date: "2026-01-01", Tokopedia: 1390000, Shopee: 1420000 },
      { date: "2026-02-01", Tokopedia: 1350000, Shopee: 1380000 },
      { date: "2026-03-01", Tokopedia: 1320000, Shopee: 1350000 },
      { date: "2026-04-01", Tokopedia: 1280000, Shopee: 1310000 },
      { date: "2026-05-01", Tokopedia: 1250000, Shopee: 1270000 },
      { date: "2026-06-01", Tokopedia: 1220000, Shopee: 1250000 }
    ]
  }
];

const defaultArticles: BlogArticle[] = [
  {
    id: "art-1",
    title: "Review Jujur ASUS ROG Zephyrus G14 (2025): Ultrabook Gaming Tanpa Tandingan",
    slug: "review-jujur-asus-rog-zephyrus-g14-2025-ultrabook-gaming",
    category: "laptop-komputer",
    tags: ["ASUS", "ROG", "Laptop Gaming", "OLED", "Zephyrus G14"],
    featuredImage: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=450&fit=crop&q=80",
    author: "Rian Hidayat",
    publishDate: "2026-06-15",
    type: "Review Produk",
    views: 4250,
    seoTitle: "Review ASUS ROG Zephyrus G14 2025 Indonesia - Portal Affiliate",
    metaDescription: "Mencari review mendalam laptop gaming teringan ASUS ROG Zephyrus G14 2025? Temukan kelebihan, kekurangan, spesifikasi, dan link pembelian affiliate termurah disini.",
    content: `<h3>Pendahuluan</h3>
    <p>Bagi Anda yang bermobilitas tinggi namun membutuhkan performa olah grafis kelas wahid, laptop 14 inci selalu menjadi 'sweet-spot'. Di tahun 2025 ini, ASUS kembali menggebrak pasar laptop premium tanah air lewat kehadiran <strong>ASUS ROG Zephyrus G14</strong>.</p>
    
    <h3>Desain dan Kualitas Bodi Premium</h3>
    <p>Berbeda dengan generasi terdahulu yang menggunakan bahan polikarbonat di beberapa bagian, sasis model 2025 sepenuhnya dibentuk dari satu blok aluminium CNC presisi tinggi. Samping sasis dipoles mengilap meniru estetika produk mewah. Ketebalannya mencengangkan: hanya 1.59cm dengan bobot berselisih tipis di 1.5kg. Laptop ini pas dimasukkan ke tas kerja tanpa membebani bahu.</p>
    
    <h3>Keindahan Layar ROG Nebula OLED</h3>
    <p>Layar laptop ini adalah primadona utama. Panel ROG Nebula OLED beresolusi 3K dengan refresh rate 120Hz dan response time kilat 0.2ms memberikan kedalaman hitam absolut. Pengeditan video profesional maupun bermain game kompetitif terasa begitu responsif dan memanjakan mata.</p>
    
    <h3>Kesimpulan dan Rekomendasi</h3>
    <p>ASUS ROG Zephyrus G14 (2025) bukan sekadar laptop gaming; ini adalah simbol kemajuan rekayasa hardware modern. Sangat pas untuk profesional kreatif yang sesekali ingin menikmati game AAA dengan frame rate mulus. Cari harga terbaik dan diskon cashback menarik di marketplace partner kami melalui tombol Shopee, Tokopedia, dan Blibli di bawah!</p>`
  },
  {
    id: "art-2",
    title: "Pertempuran Flagship: Samsung Galaxy S24 Ultra vs HP Premium Lain, Siapa Rajanya?",
    slug: "pertempuran-flagship-samsung-galaxy-s24-ultra-vs-hp-premium",
    category: "gadget-handphone",
    tags: ["Samsung", "S24 Ultra", "Flagship", "Smartphone", "Galaxy AI"],
    featuredImage: "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=800&h=450&fit=crop&q=80",
    author: "Amanda Wijaya",
    publishDate: "2026-06-20",
    type: "Perbandingan Produk",
    views: 6100,
    seoTitle: "Perbandingan Samsung Galaxy S24 Ultra vs Pesaing Flagship 2026",
    metaDescription: "Ketahui perbedaan spesifikasi, performa kamera, dan kecerdasan AI dalam perbandingan komprehensif Samsung Galaxy S24 Ultra di Indonesia.",
    content: `<h3>Pertempuran Flagship Kasta Tertinggi</h3>
    <p>Persaingan smartphone papan atas di Indonesia semakin memanas. Samsung Galaxy S24 Ultra hadir membawa senjata baru yang tidak dimiliki pesaingnya: <strong>Galaxy AI</strong> terintegrasi penuh.</p>
    
    <h3>Keunggulan Mutlak Titanium dan Layar Gorilla Armor</h3>
    <p>Penggunaan sasis Titanium pada S24 Ultra memberikan impresi genggaman yang jauh lebih kokoh dibandingkan aluminium biasa. Namun, inovasi terbaik justru terletak pada lapisan pelindung layar Gorilla Armor. Lapisan ini mampu mengeliminasi hingga 75% refleksi cahaya luar, membuat gambar tetap berkilau tajam meskipun digunakan langsung di luar ruangan.</p>
    
    <h3>Kamera 200MP dan Zoom Optikal Baru</h3>
    <p>Beralih dari zoom 10x optik lama, Samsung kini menerapkan sensor zoom 5x beresolusi 50MP yang jauh lebih fungsional untuk pemotretan sehari-hari dengan detail tajam. Sensor megapiksel yang besar ini sangat bersinar pada mode malam (Nightography) yang minim noise.</p>
    
    <h3>Keputusan Akhir</h3>
    <p>Bagi penikmat produktivitas, kehadiran stylus S-Pen bawaan dan masa garansi update software 7 tahun menobatkan Galaxy S24 Ultra sebagai investasi smartphone jangka panjang paling aman saat ini. Gunakan fitur pembanding harga kami untuk melacak penawaran termurah dari Shopee, Tokopedia, dan TikTok Shop!</p>`
  }
];

const defaultProgrammaticPages: ProgrammaticPage[] = [
  {
    id: "prog-1",
    slug: "laptop-gaming-terbaik-murah-indonesia",
    title: "Rekomendasi Laptop Gaming Terbaik dan Termurah di Indonesia",
    keyword: "Laptop Gaming Murah",
    category: "laptop-komputer",
    introText: "Temukan jajaran laptop gaming terbaik dengan spesifikasi gahar namun tetap ramah di kantong Anda. Kami mengumpulkan harga affiliate terkini langsung dari Shopee, Tokopedia, dan Blibli untuk membantu Anda mendapatkan penawaran termurah dan terlengkap.",
    metaTitle: "Laptop Gaming Terbaik dan Murah di Indonesia 2026",
    metaDescription: "Rekomendasi laptop gaming berspesifikasi gahar dengan harga termurah di Indonesia. Bandingkan harga dari Shopee, Tokopedia, dan Lazada secara real-time!"
  },
  {
    id: "prog-2",
    slug: "sepatu-lari-lokal-terbaik- specs",
    title: "Daftar Sepatu Lari Lokal Terbaik Berkualitas Internasional",
    keyword: "Sepatu Lari Terbaik",
    category: "olahraga-outdoor",
    brand: "Specs",
    introText: "Siapa bilang brand lokal tidak bisa bersaing dengan raksasa global? Brand Specs membuktikan sepatu olahraga rancangan anak bangsa mampu merajai lintasan lari futsal dengan bobot super ringan dan harga sangat terjangkau.",
    metaTitle: "Sepatu Lari Lokal Terbaik dan Termurah Berkualitas Tinggi",
    metaDescription: "Dapatkan daftar rekomendasi sepatu lari Specs lokal terbaik dengan perbandingan harga affiliate termurah langsung dari Shopee dan Tokopedia."
  }
];

// --- DATABASE STATE MANAGEMENT ---
let db: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  articles: BlogArticle[];
  programmaticPages: ProgrammaticPage[];
  clicks: ClickAnalytic[];
  searches: SearchAnalytic[];
  alerts: PriceAlert[];
  cronLogs: CronLog[];
} = {
  products: defaultProducts,
  categories: defaultCategories,
  brands: defaultBrands,
  articles: defaultArticles,
  programmaticPages: defaultProgrammaticPages,
  clicks: [],
  searches: [],
  alerts: [],
  cronLogs: []
};

// Initialize file database
function loadDatabase() {
  if (fs.existsSync(DATABASE_FILE)) {
    try {
      const data = fs.readFileSync(DATABASE_FILE, "utf-8");
      db = JSON.parse(data);
      console.log("Database file loaded successfully.");
    } catch (e) {
      console.error("Error reading database file, writing default seed data.", e);
      saveDatabase();
    }
  } else {
    saveDatabase();
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DATABASE_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving database file", e);
  }
}

loadDatabase();

// --- GEMINI API CLIENT INITIALIZATION ---
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not configured or still a placeholder. AI operations will use highly detailed procedural fallback generations.");
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Gemini SDK initialized successfully.");
    } catch (e) {
      console.error("Failed to initialize Gemini SDK:", e);
    }
  }
  return aiClient;
}

// --- EXPRESS APPLICATION SETUP ---
const app = express();
app.use(express.json({ limit: '10mb' }));

// --- API ENDPOINTS ---

// 1. PRODUCTS API
// Supports: Category, Brand, Marketplace, Stock, Price Min/Max, Sort, Filter Tag
app.get("/api/products", (req, res) => {
  const { category, brand, query, sort, minPrice, maxPrice, inStock, marketplace, freeShipping, cod, isOfficial } = req.query;
  let filtered = [...db.products];

  // Full-Text Search
  if (query) {
    const q = (query as string).toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  }

  // Category Filter
  if (category && category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  // Brand Filter
  if (brand && brand !== "all") {
    filtered = filtered.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
  }

  // Price Filters
  if (minPrice) {
    const min = parseFloat(minPrice as string);
    filtered = filtered.filter(p => p.lowestPrice >= min);
  }
  if (maxPrice) {
    const max = parseFloat(maxPrice as string);
    filtered = filtered.filter(p => p.lowestPrice <= max);
  }

  // In Stock Filter
  if (inStock === "true") {
    filtered = filtered.filter(p => p.affiliates.some(a => a.inStock));
  }

  // Free Shipping Filter
  if (freeShipping === "true") {
    filtered = filtered.filter(p => p.freeShipping);
  }

  // COD Filter
  if (cod === "true") {
    filtered = filtered.filter(p => p.cod);
  }

  // Official / Mall Filter
  if (isOfficial === "true") {
    filtered = filtered.filter(p => p.isOfficial || p.isMall);
  }

  // Marketplace filter
  if (marketplace && marketplace !== "all") {
    filtered = filtered.filter(p => p.affiliates.some(a => a.platform.toLowerCase() === (marketplace as string).toLowerCase()));
  }

  // Sorting
  if (sort) {
    switch (sort) {
      case "price-asc":
        filtered.sort((a, b) => a.lowestPrice - b.lowestPrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.lowestPrice - a.lowestPrice);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "sales":
        filtered.sort((a, b) => b.salesCount - a.salesCount);
        break;
      case "popular":
        filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
  }

  res.json(filtered);
});

// Single Product Details
app.get("/api/products/:slug", (req, res) => {
  const product = db.products.find(p => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// Manage products (Add/Edit for Admin Panel)
app.post("/api/admin/products", (req, res) => {
  const pData = req.body;
  if (!pData.name || !pData.category || !pData.brand) {
    return res.status(400).json({ error: "Name, category, and brand are required" });
  }

  const slug = pData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  
  const lowestPrice = Math.min(...pData.affiliates.map((a: any) => parseFloat(a.price) || 999999999));
  const highestPrice = Math.max(...pData.affiliates.map((a: any) => parseFloat(a.price) || 0));

  const newProduct: Product = {
    id: pData.id || "prod-" + Date.now(),
    name: pData.name,
    slug: slug,
    brand: pData.brand,
    category: pData.category,
    description: pData.description || "",
    specs: pData.specs || {},
    pros: pData.pros || [],
    cons: pData.cons || [],
    rating: parseFloat(pData.rating) || 4.5,
    reviewCount: parseInt(pData.reviewCount) || 1,
    salesCount: parseInt(pData.salesCount) || 10,
    images: pData.images && pData.images.length > 0 ? pData.images : ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop&q=80"],
    videoUrl: pData.videoUrl || "",
    isTrending: !!pData.isTrending,
    isViral: !!pData.isViral,
    isPopular: !!pData.isPopular,
    isNew: !!pData.isNew,
    isEditorChoice: !!pData.isEditorChoice,
    aiSummary: pData.aiSummary || "",
    aiReview: pData.aiReview || "",
    faqs: pData.faqs || [],
    affiliates: pData.affiliates || [],
    priceHistory: pData.priceHistory || [
      { date: new Date().toISOString().split("T")[0], Shopee: lowestPrice }
    ],
    lowestPrice,
    highestPrice,
    colors: pData.colors || [],
    sizes: pData.sizes || [],
    warranty: pData.warranty || "",
    isOfficial: !!pData.isOfficial,
    isMall: !!pData.isMall,
    freeShipping: !!pData.freeShipping,
    cod: !!pData.cod
  };

  const existingIdx = db.products.findIndex(p => p.id === newProduct.id || p.slug === newProduct.slug);
  if (existingIdx >= 0) {
    db.products[existingIdx] = { ...db.products[existingIdx], ...newProduct };
  } else {
    db.products.push(newProduct);
  }

  saveDatabase();
  res.json({ success: true, product: newProduct });
});

app.delete("/api/admin/products/:id", (req, res) => {
  const initialLen = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);
  if (db.products.length === initialLen) {
    return res.status(404).json({ error: "Product not found" });
  }
  saveDatabase();
  res.json({ success: true, message: "Product deleted successfully" });
});

// 2. CATEGORIES & BRANDS
app.get("/api/categories", (req, res) => {
  res.json(db.categories);
});

app.get("/api/brands", (req, res) => {
  res.json(db.brands);
});

// 3. BLOG CMS
app.get("/api/articles", (req, res) => {
  const { type, query } = req.query;
  let filtered = [...db.articles];

  if (type) {
    filtered = filtered.filter(a => a.type === type);
  }

  if (query) {
    const q = (query as string).toLowerCase();
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.content.toLowerCase().includes(q) || 
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json(filtered);
});

app.get("/api/articles/:slug", (req, res) => {
  const article = db.articles.find(a => a.slug === req.params.slug);
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  // Increment view counter dynamically
  article.views += 1;
  saveDatabase();
  res.json(article);
});

app.post("/api/admin/articles", (req, res) => {
  const aData = req.body;
  if (!aData.title || !aData.content || !aData.type) {
    return res.status(400).json({ error: "Title, Content, and Type are required" });
  }

  const slug = aData.slug || aData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const newArticle: BlogArticle = {
    id: aData.id || "art-" + Date.now(),
    title: aData.title,
    slug: slug,
    content: aData.content,
    type: aData.type,
    tags: aData.tags || [],
    category: aData.category || "all",
    featuredImage: aData.featuredImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop&q=80",
    author: aData.author || "Admin",
    publishDate: aData.publishDate || new Date().toISOString().split("T")[0],
    views: aData.views || 0,
    seoTitle: aData.seoTitle || `${aData.title} - Affiliate Marketplace`,
    metaDescription: aData.metaDescription || aData.content.replace(/<[^>]*>/g, "").substring(0, 160),
    faqs: aData.faqs || []
  };

  const existingIdx = db.articles.findIndex(a => a.id === newArticle.id || a.slug === newArticle.slug);
  if (existingIdx >= 0) {
    db.articles[existingIdx] = { ...db.articles[existingIdx], ...newArticle };
  } else {
    db.articles.push(newArticle);
  }

  saveDatabase();
  res.json({ success: true, article: newArticle });
});

app.delete("/api/admin/articles/:id", (req, res) => {
  const initialLen = db.articles.length;
  db.articles = db.articles.filter(a => a.id !== req.params.id);
  if (db.articles.length === initialLen) {
    return res.status(404).json({ error: "Article not found" });
  }
  saveDatabase();
  res.json({ success: true, message: "Article deleted successfully" });
});

// 4. PRICE ALERTS
app.post("/api/alerts", (req, res) => {
  const { productId, targetPrice, email, whatsapp, telegram } = req.body;
  if (!productId || !targetPrice || !email) {
    return res.status(400).json({ error: "Product, target price, and email are required" });
  }

  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  const newAlert: PriceAlert = {
    id: "alert-" + Date.now(),
    productId,
    productName: product.name,
    targetPrice: parseFloat(targetPrice),
    email,
    whatsapp: whatsapp || "",
    telegram: telegram || "",
    isTriggered: false,
    createdAt: new Date().toISOString()
  };

  db.alerts.push(newAlert);
  saveDatabase();
  res.json({ success: true, alert: newAlert });
});

app.get("/api/admin/alerts", (req, res) => {
  res.json(db.alerts);
});

// 5. CLICK & SEARCH ANALYTICS (Real click tracking, calculating CTRs)
app.post("/api/analytics/click", (req, res) => {
  const { productId, platform, referrer } = req.body;
  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return res.status(400).json({ error: "Invalid product" });
  }

  const newClick: ClickAnalytic = {
    id: "click-" + Date.now() + Math.random().toString(36).substring(2, 6),
    productId,
    productName: product.name,
    platform,
    timestamp: new Date().toISOString(),
    referrer: referrer || "Direct"
  };

  db.clicks.push(newClick);
  saveDatabase();
  res.json({ success: true });
});

app.post("/api/analytics/search", (req, res) => {
  const { query } = req.body;
  if (!query) return res.json({ success: false });

  const q = (query as string).toLowerCase().trim();
  const existing = db.searches.find(s => s.query === q);
  if (existing) {
    existing.count += 1;
    existing.timestamp = new Date().toISOString();
  } else {
    db.searches.push({
      id: "search-" + Date.now(),
      query: q,
      count: 1,
      timestamp: new Date().toISOString()
    });
  }

  saveDatabase();
  res.json({ success: true });
});

// Admin Analytics Overview (CTR calculation!)
app.get("/api/admin/analytics", (req, res) => {
  // Aggregate stats
  const totalClicks = db.clicks.length;
  
  // Platform distribution
  const platformClicks: Record<string, number> = {};
  db.clicks.forEach(c => {
    platformClicks[c.platform] = (platformClicks[c.platform] || 0) + 1;
  });

  // Top Products clicked
  const productClicks: Record<string, { name: string; clicks: number }> = {};
  db.clicks.forEach(c => {
    if (!productClicks[c.productId]) {
      productClicks[c.productId] = { name: c.productName, clicks: 0 };
    }
    productClicks[c.productId].clicks += 1;
  });
  const topProducts = Object.values(productClicks)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // Top searched queries
  const topSearches = [...db.searches]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Total simulated traffic
  const simulatedPageViews = 245000; // Realistic traffic count for top SEO sites
  const simulatedCTR = totalClicks > 0 ? ((totalClicks / simulatedPageViews) * 100).toFixed(2) : "4.2";

  res.json({
    totalClicks,
    pageViews: simulatedPageViews,
    ctr: parseFloat(simulatedCTR),
    platformClicks,
    topProducts,
    topSearches,
    alertsCount: db.alerts.length,
    recentClicks: db.clicks.slice(-15).reverse()
  });
});

// 6. PROGRAMMATIC SEO PAGES
app.get("/api/programmatic-pages", (req, res) => {
  res.json(db.programmaticPages);
});

app.get("/api/programmatic-pages/:slug", (req, res) => {
  const page = db.programmaticPages.find(p => p.slug === req.params.slug);
  if (!page) {
    return res.status(404).json({ error: "Programmatic page not found" });
  }
  res.json(page);
});

// Generate dynamic Programmatic SEO landing page entries (Admin)
app.post("/api/admin/programmatic-pages/generate", (req, res) => {
  const { keyword, category, brand, maxPrice } = req.body;
  if (!keyword || !category) {
    return res.status(400).json({ error: "Keyword and Category are required" });
  }

  const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const catObj = db.categories.find(c => c.slug === category);
  const catName = catObj ? catObj.name : category;

  let title = `${keyword} Terbaik dan Termurah di Indonesia`;
  if (brand) title = `${keyword} ${brand} Terbaik dan Terlengkap di Indonesia`;

  const newPage: ProgrammaticPage = {
    id: "pseo-" + Date.now(),
    slug,
    title,
    keyword,
    category,
    brand: brand || "",
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    introText: `Butuh rekomendasi untuk ${keyword}? Kami menganalisis jutaan produk di kategori ${catName} ${brand ? `dari brand ${brand}` : ""} untuk menghadirkan list perbandingan harga affiliate termurah dari Shopee, Tokopedia, TikTok, dan Lazada. Dapatkan penawaran promo diskon, voucher cashback eksklusif, serta tinjauan lengkap kelebihan dan kekurangan secara objektif di bawah ini.`,
    metaTitle: `Rekomendasi ${title} Terbaru 2026`,
    metaDescription: `Review terlengkap dan terpercaya ${keyword}. Bandingkan harga online termurah dari Shopee, Tokopedia, TikTok Shop, Lazada, Blibli secara real-time!`
  };

  db.programmaticPages.push(newPage);
  saveDatabase();
  res.json({ success: true, page: newPage });
});

// 7. AUTO SYNC CRON JOB (Periodic simulated prices, discounts, and stocks update)
app.post("/api/cron/sync", (req, res) => {
  console.log("Starting Auto Sync Cron Job...");
  let affectedProducts = 0;
  const notifications: string[] = [];

  db.products.forEach(product => {
    let priceDecreased = false;
    let priceDropPlatform = "";
    let priceDropNewValue = 0;

    product.affiliates.forEach(affiliate => {
      // Simulate price fluctuation (-5% to +5%)
      const fluctuation = (Math.random() * 10 - 5) / 100; // -0.05 to +0.05
      const oldPrice = affiliate.price;
      const newPrice = Math.round(affiliate.price * (1 + fluctuation) / 1000) * 1000;
      
      // Stock simulation
      const oldStock = affiliate.inStock;
      const newStock = Math.random() > 0.05; // 95% chance of being in stock

      // Discount simulation (between 5% and 40%)
      const discountFluctuation = Math.floor(Math.random() * 35) + 5;

      affiliate.price = newPrice;
      affiliate.inStock = newStock;
      affiliate.discount = discountFluctuation;
      affiliate.originalPrice = Math.round(newPrice / (1 - affiliate.discount / 100) / 1000) * 1000;

      if (newPrice < oldPrice) {
        priceDecreased = true;
        priceDropPlatform = affiliate.platform;
        priceDropNewValue = newPrice;
      }
    });

    // Re-calculate lowest and highest prices
    const prices = product.affiliates.map(a => a.price);
    product.lowestPrice = Math.min(...prices);
    product.highestPrice = Math.max(...prices);

    // Update Price History
    const today = new Date().toISOString().split("T")[0];
    const historyEntry: PriceHistory = { date: today };
    product.affiliates.forEach(aff => {
      historyEntry[aff.platform] = aff.price;
    });

    // Append to price history, keeping max 12 months
    if (!product.priceHistory) product.priceHistory = [];
    const dupIdx = product.priceHistory.findIndex(h => h.date === today);
    if (dupIdx >= 0) {
      product.priceHistory[dupIdx] = historyEntry;
    } else {
      product.priceHistory.push(historyEntry);
    }
    if (product.priceHistory.length > 12) {
      product.priceHistory.shift();
    }

    affectedProducts += 1;

    // Trigger Price Alerts!
    if (priceDecreased) {
      db.alerts.forEach(alert => {
        if (alert.productId === product.id && !alert.isTriggered && priceDropNewValue <= alert.targetPrice) {
          alert.isTriggered = true;
          const note = `ALERT: Harga ${product.name} turun menjadi Rp ${priceDropNewValue.toLocaleString('id-ID')} di ${priceDropPlatform}! Mengirim notifikasi ke ${alert.email}.`;
          notifications.push(note);
          console.log(note);
        }
      });
    }
  });

  const logEntry: CronLog = {
    id: "cron-" + Date.now(),
    timestamp: new Date().toISOString(),
    type: "Price & Stock Sync",
    details: `Sinkronisasi otomatis berhasil diselesaikan. Memperbarui harga, stok, dan diskon untuk ${affectedProducts} produk affiliate. Memicu ${notifications.length} notifikasi waspada harga.`,
    productsAffected: affectedProducts
  };

  db.cronLogs.unshift(logEntry);
  if (db.cronLogs.length > 30) db.cronLogs.pop();

  saveDatabase();
  res.json({ 
    success: true, 
    log: logEntry,
    notificationsTriggered: notifications 
  });
});

app.get("/api/cron/logs", (req, res) => {
  res.json(db.cronLogs);
});

// 8. GEMINI AI API: Reviews & SEO Generators
// Review generator endpoint
app.post("/api/ai/review", async (req, res) => {
  const { name, category, brand, description, specs } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Product name is required" });
  }

  const client = getGeminiClient();
  if (!client) {
    // Highly detailed local generator if Gemini is missing
    const generatedReview = `Ulasan AI untuk ${name}: Berdasarkan agregasi dari data spesifikasi dan performa dunia nyata, produk ini menawarkan solusi yang sangat kompetitif di segmen ${category}. Integrasi komponen berkualitas dari brand ${brand || "terkait"} menghasilkan pengalaman pengguna yang tangguh. Desainnya ergonomis dan modern, menjadikannya pilihan andal untuk penggunaan jangka panjang di Indonesia.`;
    const generatedSummary = `Ringkasan AI untuk ${name}: Desain tangguh, performa luar biasa, sangat andal, dan menawarkan efisiensi biaya terbaik di kelasnya.`;
    const faqs = [
      { question: `Apakah ${name} tahan lama?`, answer: `Ya, didukung material premium, produk ini dirancang untuk penggunaan jangka panjang dengan garansi resmi.` },
      { question: `Berapa konsumsi daya/efisiensi ${name}?`, answer: `Sangat efisien dan optimal untuk standard pemakaian sehari-hari.` }
    ];
    return res.json({ 
      review: generatedReview, 
      summary: generatedSummary, 
      faqs,
      pros: ["Desain premium", "Performa kencang", "Garansi resmi"],
      cons: ["Harga bersaing", "Ketersediaan stok terbatas"]
    });
  }

  try {
    const prompt = `Anda adalah seorang Senior Gadget Reviewer & Copywriter SEO profesional Indonesia. 
Buat ulasan objektif, pro & kontra, ringkasan, dan 3 FAQ menarik untuk produk berikut ini:
Nama Produk: ${name}
Merek: ${brand || "Umum"}
Kategori: ${category}
Deskripsi: ${description || ""}
Spesifikasi: ${JSON.stringify(specs || {})}

Berikan respons eksklusif dalam format JSON yang valid dengan skema berikut:
{
  "review": "Ulasan komprehensif 2 paragraf yang SEO-friendly, tajam, dan objektif dalam Bahasa Indonesia.",
  "summary": "Ringkasan ulasan 1 kalimat yang menonjolkan nilai jual utama produk.",
  "pros": ["Kelebihan 1", "Kelebihan 2", "Kelebihan 3"],
  "cons": ["Kekurangan 1", "Kekurangan 2"],
  "faqs": [
    { "question": "Pertanyaan FAQ 1?", "answer": "Jawaban FAQ 1." },
    { "question": "Pertanyaan FAQ 2?", "answer": "Jawaban FAQ 2." },
    { "question": "Pertanyaan FAQ 3?", "answer": "Jawaban FAQ 3." }
  ]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            review: { type: Type.STRING },
            summary: { type: Type.STRING },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
            faqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            }
          },
          required: ["review", "summary", "pros", "cons", "faqs"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (e: any) {
    console.error("Gemini AI Review execution failure:", e);
    res.status(500).json({ error: e.message || "Failed to generate AI reviews" });
  }
});

// Full article content generator endpoint
app.post("/api/ai/article", async (req, res) => {
  const { title, type, category, keyword } = req.body;
  if (!title || !type) {
    return res.status(400).json({ error: "Title and Type are required" });
  }

  const client = getGeminiClient();
  if (!client) {
    // highly descriptive procedurally generated fallback
    const fallbackHTML = `<h3>Pengantar Penting mengenai ${title}</h3>
<p>Topik tentang <strong>${keyword || title}</strong> kini tengah menjadi sorotan hangat bagi kalangan konsumen di Indonesia. Sebagai media penilai tepercaya, kami merangkum detail panduan ini untuk Anda.</p>
<h3>Analisis Mendalam dan Fitur Kunci</h3>
<p>Memilih produk di kategori ${category || "terkait"} memerlukan kecermatan tinggi. Faktor-faktor utama seperti perbandingan harga antar platform (Shopee vs Tokopedia), ketersediaan stok, kupon diskon tambahan, dan kegunaan harian adalah pilar krusial yang menentukan kepuasan pembelian Anda.</p>
<h3>Rekomendasi Utama</h3>
<p>Gunakan sistem smart comparison kami di halaman depan untuk melacak pergerakan grafik harga produk pilihan Anda guna mendapatkan deal termurah!</p>`;
    
    return res.json({
      content: fallbackHTML,
      seoTitle: `${title} - Rekomendasi Affiliate Terbaik`,
      metaDescription: `Artikel panduan terlengkap mengenai ${title}. Pelajari tips, kelebihan, kekurangan, dan perbandingan harga Shopee & Tokopedia.`,
      faqs: [
        { question: `Apa yang menarik dari ${keyword || title}?`, answer: `Keunggulan komparatif nilai fungsionalitas dan efisiensi biaya.` },
        { question: `Di mana membeli dengan harga termurah?`, answer: `Kami menyarankan memeriksa Shopee atau Tokopedia melalui tautan affiliate berdiskon kami.` }
      ],
      tags: [category || "Umum", "Affiliate", "Belanja", keyword || "Rekomendasi"]
    });
  }

  try {
    const prompt = `Anda adalah seorang Senior Content Creator, SEO Specialist, dan Affiliate Marketer top di Indonesia.
Tulis artikel blog pilar yang mendalam, informatif, sangat SEO-friendly, dan menarik dalam format HTML bersih.
Judul Artikel: ${title}
Jenis Artikel: ${type}
Kategori: ${category || "Gaya Hidup"}
Kata Kunci SEO Fokus: ${keyword || title}

Berikan respons eksklusif dalam format JSON yang valid dengan skema berikut:
{
  "content": "Konten artikel lengkap dalam format HTML (gunakan h3, p, strong, ul, li). Minimal 3 paragraf besar, tanpa tag body, html, atau head.",
  "seoTitle": "Judul SEO Title maksimal 60 karakter yang memicu klik CTR tinggi.",
  "metaDescription": "Meta description maksimal 155 karakter yang kaya kata kunci.",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "faqs": [
    { "question": "Pertanyaan FAQ Terkait?", "answer": "Jawaban FAQ Terkait." },
    { "question": "Pertanyaan FAQ Terkait Lain?", "answer": "Jawaban FAQ Terkait Lain." }
  ]
}`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            seoTitle: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            faqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING }
                },
                required: ["question", "answer"]
              }
            }
          },
          required: ["content", "seoTitle", "metaDescription", "tags", "faqs"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (e: any) {
    console.error("Gemini AI Article execution failure:", e);
    res.status(500).json({ error: e.message || "Failed to generate AI blog post" });
  }
});

// 9. DATA MULTI-FORMAT IMPORTER (CSV, JSON, XML, API)
app.post("/api/admin/import", (req, res) => {
  const { format, rawData } = req.body;
  if (!rawData) {
    return res.status(400).json({ error: "No raw data provided for import" });
  }

  let importedCount = 0;
  const errors: string[] = [];

  try {
    let productsToImport: any[] = [];

    if (format === "json") {
      const parsed = JSON.parse(rawData);
      productsToImport = Array.isArray(parsed) ? parsed : [parsed];
    } else if (format === "csv") {
      const lines = rawData.split("\n");
      if (lines.length < 2) throw new Error("CSV must have a header line and data line");
      const headers = lines[0].split(",").map((h: string) => h.trim().replace(/['"]/g, ""));
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(",").map((c: string) => c.trim().replace(/['"]/g, ""));
        const item: any = {};
        headers.forEach((h: string, idx: number) => {
          item[h] = cols[idx];
        });
        productsToImport.push(item);
      }
    } else if (format === "xml") {
      // Basic XML parsing simulation to support standard XML feeds
      const regex = /<product>([\s\S]*?)<\/product>/g;
      let match;
      while ((match = regex.exec(rawData)) !== null) {
        const prodXml = match[1];
        const item: any = {};
        const tags = ["id", "name", "brand", "category", "description", "price", "affiliateUrl"];
        tags.forEach(tag => {
          const tagRegex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, "i");
          const tagMatch = tagRegex.exec(prodXml);
          if (tagMatch) item[tag] = tagMatch[1];
        });
        productsToImport.push(item);
      }
    } else {
      return res.status(400).json({ error: "Unsupported format. Use JSON, CSV, or XML" });
    }

    // Convert imported products to our database model
    productsToImport.forEach((p, idx) => {
      try {
        if (!p.name) {
          errors.push(`Row ${idx + 1}: Name is missing, skipping.`);
          return;
        }

        const name = p.name;
        const slug = p.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const category = p.category || "gadget-handphone";
        const brand = p.brand || "Umum";
        const description = p.description || `Deskripsi produk affiliate ${name}`;
        
        const shopeePrice = parseFloat(p.price || p.shopeePrice || "500000");
        const tokopediaPrice = shopeePrice * 0.99;

        // Build affiliate links
        const affiliates: AffiliateLink[] = [
          {
            id: `aff-import-${Date.now()}-${idx}-shopee`,
            platform: "Shopee",
            price: shopeePrice,
            originalPrice: Math.round(shopeePrice * 1.2),
            discount: 20,
            affiliateUrl: p.affiliateUrl || "https://shopee.co.id",
            inStock: true
          },
          {
            id: `aff-import-${Date.now()}-${idx}-tokopedia`,
            platform: "Tokopedia",
            price: tokopediaPrice,
            originalPrice: Math.round(tokopediaPrice * 1.2),
            discount: 20,
            affiliateUrl: p.affiliateUrl || "https://tokopedia.com",
            inStock: true
          }
        ];

        const newProduct: Product = {
          id: p.id || `import-prod-${Date.now()}-${idx}`,
          name,
          slug,
          brand,
          category,
          description,
          specs: p.specs || { "Model": name, "Asal": "Import Feed" },
          pros: p.pros || ["Kualitas andal", "Harga terjangkau"],
          cons: p.cons || ["Stok fluktuatif"],
          rating: parseFloat(p.rating) || 4.5,
          reviewCount: parseInt(p.reviewCount) || 12,
          salesCount: parseInt(p.salesCount) || 100,
          images: p.images || ["https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop&q=80"],
          affiliates,
          lowestPrice: Math.min(...affiliates.map(a => a.price)),
          highestPrice: Math.max(...affiliates.map(a => a.price)),
          priceHistory: [
            { date: new Date().toISOString().split("T")[0], Shopee: shopeePrice, Tokopedia: tokopediaPrice }
          ],
          faqs: p.faqs || [
            { question: `Apakah ${name} asli?`, answer: "Ya, kami hanya merekomendasikan produk orisinal dari official partner store." }
          ]
        };

        // Upsert
        const dupIdx = db.products.findIndex(existing => existing.id === newProduct.id || existing.slug === newProduct.slug);
        if (dupIdx >= 0) {
          db.products[dupIdx] = { ...db.products[dupIdx], ...newProduct };
        } else {
          db.products.push(newProduct);
        }

        importedCount += 1;
      } catch (itemErr: any) {
        errors.push(`Row ${idx + 1}: ${itemErr.message || "Failed to map fields"}`);
      }
    });

    saveDatabase();
    res.json({ success: true, importedCount, errors });
  } catch (e: any) {
    res.status(400).json({ error: "Import parsing failed: " + e.message });
  }
});

// Reset Database to Seed Data
app.post("/api/admin/reset-db", (req, res) => {
  db = {
    products: defaultProducts,
    categories: defaultCategories,
    brands: defaultBrands,
    articles: defaultArticles,
    programmaticPages: defaultProgrammaticPages,
    clicks: [],
    searches: [],
    alerts: [],
    cronLogs: []
  };
  saveDatabase();
  res.json({ success: true, message: "Database reset to factory defaults successfully." });
});

// --- VITE MIDDLEWARE SETUP FOR DEV VS PRODUCTION ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // --- START SERVER ---
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Affiliate Engine] Running on http://localhost:${PORT}`);
  });
}

startServer();
