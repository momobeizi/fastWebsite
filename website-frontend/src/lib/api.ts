const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';

// 后端服务地址（用于拼接上传的图片资源）
const SERVER_BASE = process.env.NEXT_PUBLIC_SERVER_BASE || 'http://localhost:3000';

/**
 * 将图片地址转换为完整的可访问 URL
 * 如果是以 /uploads 开头的相对路径，拼接后端服务地址
 */
export function resolveImageUrl(url?: string): string {
  if (!url) return '';
  // 已经是完整 URL 直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // 相对路径拼接后端地址
  if (url.startsWith('/')) return `${SERVER_BASE}${url}`;
  return url;
}

/**
 * 将 HTML 实体反转义（富文本内容可能被转义存储）
 */
export function unescapeHtml(html?: string): string {
  if (!html) return '';
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

export interface WebsiteConfig {
  siteName: string;
  logo?: string;
  favicon?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
  footerInfo?: string;
  icp?: string;
  email?: string;
  contactPhone?: string;
  address?: string;
  socials?: { platform: string; name: string; url?: string }[];
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

export interface SkuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock?: number;
  status: number;
  content?: string;
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
  skus?: SkuItem[];
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

export interface WebsiteContact {
  id: number;
  name: string;
  phone: string;
  wechat?: string;
  title?: string;
  avatar?: string;
  sort: number;
  status: number;
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

// 启用联系人列表
export const getActiveContacts = () =>
  fetchApi<WebsiteContact[]>('/website/contact/active');
