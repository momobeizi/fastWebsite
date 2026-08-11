import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('website_banner')
export class WebsiteBanner extends BaseEntity {
  @Column({ length: 200, nullable: true, comment: '标题' })
  title?: string;

  @Column({ length: 200, nullable: true, comment: '副标题' })
  subtitle?: string;

  @Column({ length: 255, comment: '图片地址' })
  image: string;

  @Column({ length: 200, nullable: true, comment: '跳转链接' })
  link?: string;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({ length: 20, default: 'home', comment: '位置 home/about等' })
  position: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态 0禁用 1启用' })
  status: number;
}
