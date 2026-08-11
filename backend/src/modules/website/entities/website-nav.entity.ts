import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('website_nav')
export class WebsiteNav extends BaseEntity {
  @Column({ length: 50, comment: '菜单名称' })
  name: string;

  @Column({ length: 200, comment: '链接地址' })
  url: string;

  @Column({ type: 'int', default: 0, comment: '父级ID' })
  parentId: number;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({ type: 'tinyint', default: 1, comment: '是否显示 0否 1是' })
  visible: number;

  @Column({ type: 'tinyint', default: 0, comment: '类型 0自定义 1页面 2文章分类 3产品分类' })
  type: number;

  @Column({ type: 'int', nullable: true, comment: '关联ID' })
  targetId?: number;
}
