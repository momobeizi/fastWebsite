import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('website_config')
export class WebsiteConfig extends BaseEntity {
  @Column({ length: 100, comment: '网站名称' })
  siteName: string;

  @Column({ length: 255, nullable: true, comment: 'Logo地址' })
  logo?: string;

  @Column({ length: 255, nullable: true, comment: '网站图标' })
  favicon?: string;

  @Column({ length: 200, nullable: true, comment: 'SEO标题' })
  seoTitle?: string;

  @Column({ length: 500, nullable: true, comment: 'SEO关键词' })
  seoKeywords?: string;

  @Column({ length: 500, nullable: true, comment: 'SEO描述' })
  seoDescription?: string;

  @Column({ type: 'text', nullable: true, comment: '页脚信息' })
  footerInfo?: string;

  @Column({ length: 50, nullable: true, comment: 'ICP备案号' })
  icp?: string;
}
