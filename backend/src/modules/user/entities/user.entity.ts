import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { formatDate } from 'src/common/utils';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @CreateDateColumn({ comment: '创建时间' })
  @Transform(({ value }) => formatDate(value))
  createTime!: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Transform(({ value }) => formatDate(value))
  updateTime!: Date;
}
