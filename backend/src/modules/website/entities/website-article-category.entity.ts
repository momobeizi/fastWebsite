import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('website_article_category')
export class WebsiteArticleCategory extends BaseEntity {
  @Column({ length: 50, comment: '分类名称' })
  name: string;

  @Column({ length: 50, unique: true, comment: 'SEO URL' })
  slug: string;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;
}
