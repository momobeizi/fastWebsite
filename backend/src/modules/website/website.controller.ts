import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebsiteService } from './website.service';
import { Paginate } from 'nestjs-paginate';
import type { PaginateQuery } from 'nestjs-paginate';

@ApiTags('官网管理')
@Controller('website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  // ========== 配置 ==========
  @ApiOperation({ summary: '获取网站配置' })
  @Get('/config')
  getConfig() { return this.websiteService.getConfig(); }

  @ApiOperation({ summary: '保存网站配置' })
  @Post('/config')
  saveConfig(@Body() dto: any) { return this.websiteService.saveConfig(dto); }

  // ========== Banner ==========
  @ApiOperation({ summary: 'Banner列表' })
  @Get('/banner/list')
  getBannerList(@Paginate() query: PaginateQuery) { return this.websiteService.getBannerList(query); }

  @ApiOperation({ summary: '新增Banner' })
  @Post('/banner/add')
  addBanner(@Body() dto: any) { return this.websiteService.addBanner(dto); }

  @ApiOperation({ summary: '更新Banner' })
  @Post('/banner/update')
  updateBanner(@Body() dto: any) { return this.websiteService.updateBanner(dto); }

  @ApiOperation({ summary: '删除Banner' })
  @Get('/banner/delete/:id')
  deleteBanner(@Param('id') id: number) { return this.websiteService.deleteBanner(id); }

  // ========== 导航 ==========
  @ApiOperation({ summary: '获取导航列表' })
  @Get('/nav/list')
  getNavList() { return this.websiteService.getNavList(); }

  @ApiOperation({ summary: '保存导航' })
  @Post('/nav/save')
  saveNavList(@Body() dtos: any[]) { return this.websiteService.saveNavList(dtos); }

  // ========== 文章分类 ==========
  @Get('/article/category/list')
  getArticleCategoryList(@Paginate() query: PaginateQuery) { return this.websiteService.getArticleCategoryList(query); }
  @Post('/article/category/add')
  addArticleCategory(@Body() dto: any) { return this.websiteService.addArticleCategory(dto); }
  @Post('/article/category/update')
  updateArticleCategory(@Body() dto: any) { return this.websiteService.updateArticleCategory(dto); }
  @Get('/article/category/delete/:id')
  deleteArticleCategory(@Param('id') id: number) { return this.websiteService.deleteArticleCategory(id); }

  // ========== 文章 ==========
  @Get('/article/list')
  getArticleList(@Paginate() query: PaginateQuery) { return this.websiteService.getArticleList(query); }
  @Get('/article/info/:id')
  getArticleById(@Param('id') id: number) { return this.websiteService.getArticleById(id); }
  @Get('/article/slug/:slug')
  getArticleBySlug(@Param('slug') slug: string) { return this.websiteService.getArticleBySlug(slug); }
  @Post('/article/add')
  addArticle(@Body() dto: any) { return this.websiteService.addArticle(dto); }
  @Post('/article/update')
  updateArticle(@Body() dto: any) { return this.websiteService.updateArticle(dto); }
  @Get('/article/delete/:id')
  deleteArticle(@Param('id') id: number) { return this.websiteService.deleteArticle(id); }

  // ========== 产品分类 ==========
  @Get('/product/category/list')
  getProductCategoryList(@Paginate() query: PaginateQuery) { return this.websiteService.getProductCategoryList(query); }
  @Post('/product/category/add')
  addProductCategory(@Body() dto: any) { return this.websiteService.addProductCategory(dto); }
  @Post('/product/category/update')
  updateProductCategory(@Body() dto: any) { return this.websiteService.updateProductCategory(dto); }
  @Get('/product/category/delete/:id')
  deleteProductCategory(@Param('id') id: number) { return this.websiteService.deleteProductCategory(id); }

  // ========== 产品 ==========
  @Get('/product/list')
  getProductList(@Paginate() query: PaginateQuery) { return this.websiteService.getProductList(query); }
  @Get('/product/info/:id')
  getProductById(@Param('id') id: number) { return this.websiteService.getProductById(id); }
  @Get('/product/slug/:slug')
  getProductBySlug(@Param('slug') slug: string) { return this.websiteService.getProductBySlug(slug); }
  @Post('/product/add')
  addProduct(@Body() dto: any) { return this.websiteService.addProduct(dto); }
  @Post('/product/update')
  updateProduct(@Body() dto: any) { return this.websiteService.updateProduct(dto); }
  @Get('/product/delete/:id')
  deleteProduct(@Param('id') id: number) { return this.websiteService.deleteProduct(id); }

  // ========== 单页面 ==========
  @Get('/page/list')
  getPageList(@Paginate() query: PaginateQuery) { return this.websiteService.getPageList(query); }
  @Get('/page/info/:id')
  getPageById(@Param('id') id: number) { return this.websiteService.getPageById(id); }
  @Get('/page/slug/:slug')
  getPageBySlug(@Param('slug') slug: string) { return this.websiteService.getPageBySlug(slug); }
  @Post('/page/add')
  addPage(@Body() dto: any) { return this.websiteService.addPage(dto); }
  @Post('/page/update')
  updatePage(@Body() dto: any) { return this.websiteService.updatePage(dto); }
  @Get('/page/delete/:id')
  deletePage(@Param('id') id: number) { return this.websiteService.deletePage(id); }

  // ========== 联系人 ==========
  @ApiOperation({ summary: '联系人列表' })
  @Get('/contact/list')
  getContactList(@Paginate() query: PaginateQuery) { return this.websiteService.getContactList(query); }

  @ApiOperation({ summary: '启用联系人列表' })
  @Get('/contact/active')
  getActiveContacts() { return this.websiteService.getActiveContacts(); }

  @ApiOperation({ summary: '联系人详情' })
  @Get('/contact/info/:id')
  getContactById(@Param('id') id: number) { return this.websiteService.getContactById(id); }

  @ApiOperation({ summary: '新增联系人' })
  @Post('/contact/add')
  addContact(@Body() dto: any) { return this.websiteService.addContact(dto); }

  @ApiOperation({ summary: '更新联系人' })
  @Post('/contact/update')
  updateContact(@Body() dto: any) { return this.websiteService.updateContact(dto); }

  @ApiOperation({ summary: '删除联系人' })
  @Get('/contact/delete/:id')
  deleteContact(@Param('id') id: number) { return this.websiteService.deleteContact(id); }
}
