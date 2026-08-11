import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteConfig } from './entities/website-config.entity';
import { WebsiteNav } from './entities/website-nav.entity';
import { WebsiteBanner } from './entities/website-banner.entity';
import { WebsiteArticle } from './entities/website-article.entity';
import { WebsiteArticleCategory } from './entities/website-article-category.entity';
import { WebsiteProduct } from './entities/website-product.entity';
import { WebsiteProductCategory } from './entities/website-product-category.entity';
import { WebsitePage } from './entities/website-page.entity';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WebsiteConfig, WebsiteNav, WebsiteBanner,
      WebsiteArticle, WebsiteArticleCategory,
      WebsiteProduct, WebsiteProductCategory,
      WebsitePage,
    ]),
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService],
  exports: [WebsiteService],
})
export class WebsiteModule {}
