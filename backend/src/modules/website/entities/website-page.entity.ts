import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('website_page')
export class WebsitePage extends BaseEntity {
  @Column({ length: 200, comment: '页面标题' })
  title: string;

  @Column({ length: 200, unique: true, comment: 'SEO URL' })
  slug: string;

  @Column({ type: 'longtext', nullable: true, comment: '页面内容' })
  content?: string;

  @Column({ length: 30, comment: '页面类型 about/contact/faq/join等' })
  type: string;

  @Column({ type: 'tinyint', default: 0, comment: '状态 0草稿 1发布' })
  status: number;

  @Column({ length: 200, nullable: true, comment: 'SEO标题' })
  seoTitle?: string;

  @Column({ length: 500, nullable: true, comment: 'SEO关键词' })
  seoKeywords?: string;

  @Column({ length: 500, nullable: true, comment: 'SEO描述' })
  seoDescription?: string;
}
