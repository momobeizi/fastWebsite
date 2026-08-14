import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('website_contact')
export class WebsiteContact extends BaseEntity {
  @Column({ length: 50, comment: '联系人姓名' })
  name: string;

  @Column({ length: 20, comment: '手机号' })
  phone: string;

  @Column({ length: 50, nullable: true, comment: '微信号' })
  wechat?: string;

  @Column({ length: 50, nullable: true, comment: '职位/头衔' })
  title?: string;

  @Column({ length: 255, nullable: true, comment: '头像' })
  avatar?: string;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态 0禁用 1启用' })
  status: number;
}
