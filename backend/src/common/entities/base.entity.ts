import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { formatDate } from 'src/common/utils';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ comment: '创建时间' })
  @Transform(({ value }) => formatDate(value))
  createTime!: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Transform(({ value }) => formatDate(value))
  updateTime!: Date;

  @DeleteDateColumn({ comment: '删除时间' })
  deletedAt?: Date;
}
