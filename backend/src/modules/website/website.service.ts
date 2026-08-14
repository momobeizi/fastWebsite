import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsiteConfig } from './entities/website-config.entity';
import { WebsiteNav } from './entities/website-nav.entity';
import { WebsiteBanner } from './entities/website-banner.entity';
import { WebsiteArticle } from './entities/website-article.entity';
import { WebsiteArticleCategory } from './entities/website-article-category.entity';
import { WebsiteProduct } from './entities/website-product.entity';
import { WebsiteProductCategory } from './entities/website-product-category.entity';
import { WebsitePage } from './entities/website-page.entity';
import { WebsiteContact } from './entities/website-contact.entity';
import { paginateData } from 'src/common/utils/pagination';
import { PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectRepository(WebsiteConfig) private readonly configRepo: Repository<WebsiteConfig>,
    @InjectRepository(WebsiteNav) private readonly navRepo: Repository<WebsiteNav>,
    @InjectRepository(WebsiteBanner) private readonly bannerRepo: Repository<WebsiteBanner>,
    @InjectRepository(WebsiteArticle) private readonly articleRepo: Repository<WebsiteArticle>,
    @InjectRepository(WebsiteArticleCategory) private readonly articleCatRepo: Repository<WebsiteArticleCategory>,
    @InjectRepository(WebsiteProduct) private readonly productRepo: Repository<WebsiteProduct>,
    @InjectRepository(WebsiteProductCategory) private readonly productCatRepo: Repository<WebsiteProductCategory>,
    @InjectRepository(WebsitePage) private readonly pageRepo: Repository<WebsitePage>,
    @InjectRepository(WebsiteContact) private readonly contactRepo: Repository<WebsiteContact>,
  ) {}

  // ========== 网站配置 ==========
  async getConfig() {
    return this.configRepo.findOne({ where: { id: 1 } });
  }

  async saveConfig(dto: any) {
    const exist = await this.configRepo.findOne({ where: { id: 1 } });
    if (exist) {
      return this.configRepo.update(1, dto);
    }
    return this.configRepo.insert({ ...dto, id: 1 });
  }

  // ========== Banner ==========
  async getBannerList(query: PaginateQuery) {
    return paginateData(query, this.bannerRepo, {
      sortableColumns: ['id', 'sort', 'createTime'],
      searchableColumns: ['title'],
      defaultSortBy: [['sort', 'ASC']],
    });
  }

  async addBanner(dto: any) { return this.bannerRepo.insert(dto); }
  async updateBanner(dto: any) { const { id, ...data } = dto; return this.bannerRepo.update(id, data); }
  async deleteBanner(id: number) { return this.bannerRepo.delete(id); }
  async getBannersByPosition(position: string) {
    return this.bannerRepo.find({ where: { position, status: 1 }, order: { sort: 'ASC' } });
  }

  // ========== 导航 ==========
  async getNavList() {
    return this.navRepo.find({ where: { visible: 1 }, order: { sort: 'ASC' } });
  }

  async saveNavList(dtos: any[]) {
    const list = await this.navRepo.find();
    // 删掉不存在的
    const dtoIds = dtos.map(d => d.id).filter(Boolean);
    for (const item of list) {
      if (!dtoIds.includes(item.id)) await this.navRepo.delete(item.id);
    }
    // 插入或更新
    for (const dto of dtos) {
      if (dto.id) {
        const { id, ...data } = dto;
        await this.navRepo.update(id, data);
      } else {
        await this.navRepo.insert(dto);
      }
    }
    return this.getNavList();
  }

  // ========== 文章分类 ==========
  async getArticleCategoryList(query: PaginateQuery) {
    return paginateData(query, this.articleCatRepo, {
      sortableColumns: ['id', 'sort', 'createTime'],
      searchableColumns: ['name'],
      defaultSortBy: [['sort', 'ASC']],
    });
  }
  async addArticleCategory(dto: any) { return this.articleCatRepo.insert(dto); }
  async updateArticleCategory(dto: any) { const { id, ...data } = dto; return this.articleCatRepo.update(id, data); }
  async deleteArticleCategory(id: number) { return this.articleCatRepo.delete(id); }

  // ========== 文章 ==========
  async getArticleList(query: PaginateQuery) {
    return paginateData(query, this.articleRepo, {
      sortableColumns: ['id', 'publishTime', 'viewCount', 'createTime'],
      searchableColumns: ['title', 'summary'],
      defaultSortBy: [['createTime', 'DESC']],
      filterableColumns: { status: true, categoryId: true },
    });
  }
  async getArticleById(id: number) { return this.articleRepo.findOneBy({ id }); }
  async getArticleBySlug(slug: string) { return this.articleRepo.findOneBy({ slug }); }
  async addArticle(dto: any) { return this.articleRepo.insert(dto); }
  async updateArticle(dto: any) { const { id, ...data } = dto; return this.articleRepo.update(id, data); }
  async deleteArticle(id: number) { return this.articleRepo.delete(id); }

  // ========== 产品分类 ==========
  async getProductCategoryList(query: PaginateQuery) {
    return paginateData(query, this.productCatRepo, {
      sortableColumns: ['id', 'sort', 'createTime'],
      searchableColumns: ['name'],
      defaultSortBy: [['sort', 'ASC']],
    });
  }
  async addProductCategory(dto: any) { return this.productCatRepo.insert(dto); }
  async updateProductCategory(dto: any) { const { id, ...data } = dto; return this.productCatRepo.update(id, data); }
  async deleteProductCategory(id: number) { return this.productCatRepo.delete(id); }

  // ========== 产品 ==========
  async getProductList(query: PaginateQuery) {
    return paginateData(query, this.productRepo, {
      sortableColumns: ['id', 'sort', 'price', 'createTime'],
      searchableColumns: ['name', 'summary'],
      defaultSortBy: [['sort', 'ASC']],
      filterableColumns: { status: true, categoryId: true },
    });
  }
  async getProductById(id: number) { return this.productRepo.findOneBy({ id }); }
  async getProductBySlug(slug: string) { return this.productRepo.findOneBy({ slug }); }
  async addProduct(dto: any) { return this.productRepo.insert(dto); }
  async updateProduct(dto: any) { const { id, ...data } = dto; return this.productRepo.update(id, data); }
  async deleteProduct(id: number) { return this.productRepo.delete(id); }

  // ========== 单页面 ==========
  async getPageList(query: PaginateQuery) {
    return paginateData(query, this.pageRepo, {
      sortableColumns: ['id', 'createTime'],
      searchableColumns: ['title', 'type'],
      defaultSortBy: [['createTime', 'DESC']],
    });
  }
  async getPageById(id: number) { return this.pageRepo.findOneBy({ id }); }
  async getPageBySlug(slug: string) { return this.pageRepo.findOneBy({ slug, status: 1 }); }
  async addPage(dto: any) { return this.pageRepo.insert(dto); }
  async updatePage(dto: any) { const { id, ...data } = dto; return this.pageRepo.update(id, data); }
  async deletePage(id: number) { return this.pageRepo.delete(id); }

  // ========== 联系人 ==========
  async getContactList(query: PaginateQuery) {
    return paginateData(query, this.contactRepo, {
      sortableColumns: ['id', 'sort', 'createTime'],
      searchableColumns: ['name', 'phone', 'wechat'],
      defaultSortBy: [['sort', 'ASC']],
    });
  }
  async getContactById(id: number) { return this.contactRepo.findOneBy({ id }); }
  async getActiveContacts() {
    return this.contactRepo.find({ where: { status: 1 }, order: { sort: 'ASC' } });
  }
  async addContact(dto: any) { return this.contactRepo.insert(dto); }
  async updateContact(dto: any) { const { id, ...data } = dto; return this.contactRepo.update(id, data); }
  async deleteContact(id: number) { return this.contactRepo.delete(id); }
}
