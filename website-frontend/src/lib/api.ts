const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';

export interface WebsiteConfig {
  siteName: string;
  logo?: string;
  favicon?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  footerInfo?: string;
  icp?: string;
}

export interface WebsiteNav {
  id: number;
  name: string;
  url: string;
  parentId: number;
  sort: number;
  type: number;
  targetId?: number;
}

export interface WebsiteBanner {
  id: number;
  title?: string;
  subtitle?: string;
  image: string;
  link?: string;
}

export interface WebsiteArticle {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  cover?: string;
  categoryId: number;
  tags?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  viewCount: number;
  publishTime?: string;
  createTime: string;
}

export interface WebsiteProduct {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  content?: string;
  cover?: string;
  images?: string;
  categoryId: number;
  price?: number;
}

export interface WebsitePage {
  id: number;
  title: string;
  slug: string;
  content?: string;
  type: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data || json;
}

// 网站配置
export const getWebsiteConfig = () => fetchApi<WebsiteConfig>('/website/config');

// Banner
export const getBanners = (position = 'home') =>
  fetchApi<WebsiteBanner[]>('/website/banner/list?position=' + position);

// 导航
export const getNavList = () => fetchApi<WebsiteNav[]>('/website/nav/list');

// 文章列表
export const getArticleList = (params?: string) =>
  fetchApi<{ list: WebsiteArticle[]; total: number }>(`/website/article/list?${params || ''}`);

// 文章详情
export const getArticleBySlug = (slug: string) =>
  fetchApi<WebsiteArticle>(`/website/article/slug/${slug}`);

// 产品列表
export const getProductList = (params?: string) =>
  fetchApi<{ list: WebsiteProduct[]; total: number }>(`/website/product/list?${params || ''}`);

// 产品详情
export const getProductBySlug = (slug: string) =>
  fetchApi<WebsiteProduct>(`/website/product/slug/${slug}`);

// 单页面
export const getPageBySlug = (slug: string) =>
  fetchApi<WebsitePage>(`/website/page/slug/${slug}`);
