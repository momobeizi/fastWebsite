import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('website_article')
export class WebsiteArticle extends BaseEntity {
  @Column({ length: 200, comment: '文章标题' })
  title: string;

  @Column({ length: 200, unique: true, comment: 'SEO友好URL' })
  slug: string;

  @Column({ length: 500, nullable: true, comment: '摘要' })
  summary?: string;

  @Column({ type: 'longtext', nullable: true, comment: '文章内容' })
  content?: string;

  @Column({ length: 255, nullable: true, comment: '封面图' })
  cover?: string;

  @Column({ type: 'int', default: 0, comment: '分类ID' })
  categoryId: number;

  @Column({ length: 200, nullable: true, comment: '标签' })
  tags?: string;

  @Column({ type: 'tinyint', default: 0, comment: '状态 0草稿 1已发布' })
  status: number;

  @Column({ length: 200, nullable: true, comment: 'SEO标题' })
  seoTitle?: string;

  @Column({ length: 500, nullable: true, comment: 'SEO关键词' })
  seoKeywords?: string;

  @Column({ length: 500, nullable: true, comment: 'SEO描述' })
  seoDescription?: string;

  @Column({ type: 'int', default: 0, comment: '浏览量' })
  viewCount: number;

  @Column({ type: 'datetime', nullable: true, comment: '发布时间' })
  publishTime?: Date;
}
