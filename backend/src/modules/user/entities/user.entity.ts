import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('user')
export class User extends BaseEntity {
  @Column({ length: 50, unique: true, comment: '登录账号' })
  username!: string;

  @Column({ length: 100, comment: '加密后的密码' })
  @Exclude()
  password!: string;

  @Column({ length: 50, nullable: true, comment: '昵称' })
  nickname?: string;

  @Column({ length: 255, nullable: true, comment: '头像地址' })
  avatar?: string;

  @Column({ length: 20, nullable: true, comment: '手机号码' })
  phone?: string;

  @Column({ length: 30, default: 'editor', comment: '角色' })
  role!: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态 0禁用 1启用' })
  status!: number;

  @Column({ type: 'datetime', nullable: true, comment: '登录时间' })
  loginTime?: Date;
  
  @Column({ length: 255, nullable: true, comment: '登录ip' })
  loginIp?: string;
}
