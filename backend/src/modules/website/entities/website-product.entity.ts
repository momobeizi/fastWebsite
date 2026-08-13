import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('website_product')
export class WebsiteProduct extends BaseEntity {
  @Column({ length: 200, comment: '产品名称' })
  name: string;

  @Column({ length: 200, unique: true, comment: 'SEO友好URL' })
  slug: string;

  @Column({ length: 500, nullable: true, comment: '简介' })
  summary?: string;

  @Column({ type: 'longtext', nullable: true, comment: '产品详情' })
  content?: string;

  @Column({ length: 255, nullable: true, comment: '封面图' })
  cover?: string;

  @Column({ type: 'text', nullable: true, comment: '产品图集JSON数组' })
  images?: string;

  @Column({ type: 'int', default: 0, comment: '分类ID' })
  categoryId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '价格' })
  price?: number;

  @Column({ type: 'tinyint', default: 0, comment: '状态 0下架 1上架' })
  status: number;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({ type: 'json', nullable: true, comment: 'SKU列表' })
  skus?: any[];
}
