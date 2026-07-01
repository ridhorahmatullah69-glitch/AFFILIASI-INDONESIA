export interface AffiliateLink {
  id: string;
  platform: 'Shopee' | 'Tokopedia' | 'Lazada' | 'TikTok Shop' | 'Blibli' | 'Bukalapak';
  price: number;
  originalPrice: number;
  discount: number;
  affiliateUrl: string;
  inStock: boolean;
  couponCode?: string;
  rating?: number;
}

export interface PriceHistory {
  date: string; // YYYY-MM-DD
  Shopee?: number;
  Tokopedia?: number;
  Lazada?: number;
  "TikTok Shop"?: number;
  Blibli?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  images: string[];
  videoUrl?: string;
  isTrending?: boolean;
  isViral?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  isEditorChoice?: boolean;
  aiReview?: string;
  aiSummary?: string;
  faqs: { question: string; answer: string }[];
  affiliates: AffiliateLink[];
  priceHistory: PriceHistory[];
  lowestPrice: number;
  highestPrice: number;
  colors?: string[];
  sizes?: string[];
  warranty?: string;
  isOfficial?: boolean;
  isMall?: boolean;
  freeShipping?: boolean;
  cod?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: 'Review Produk' | 'Perbandingan Produk' | 'Tutorial' | 'Tips' | 'Promo' | 'Voucher' | 'Flash Sale' | 'Evergreen Content' | 'Buying Guide' | 'Best Product' | 'Top 10 Product';
  tags: string[];
  category: string;
  featuredImage: string;
  author: string;
  publishDate: string;
  views: number;
  seoTitle?: string;
  metaDescription?: string;
  faqs?: { question: string; answer: string }[];
}

export interface ProgrammaticPage {
  id: string;
  slug: string;
  title: string;
  keyword: string;
  category: string;
  brand?: string;
  maxPrice?: number;
  minRating?: number;
  introText: string;
  metaTitle: string;
  metaDescription: string;
}

export interface ClickAnalytic {
  id: string;
  productId: string;
  productName: string;
  platform: string;
  timestamp: string;
  referrer: string;
}

export interface SearchAnalytic {
  id: string;
  query: string;
  count: number;
  timestamp: string;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  email: string;
  whatsapp?: string;
  telegram?: string;
  isTriggered: boolean;
  createdAt: string;
}

export interface CronLog {
  id: string;
  timestamp: string;
  type: string;
  details: string;
  productsAffected: number;
}
