import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { Transform } from 'class-transformer';
import { formatDate } from 'src/common/utils';

@Entity('request_log')
export class RequestLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true, comment: '用户ID' })
  userId?: number;

  @Column({ length: 50, nullable: true, comment: '用户名' })
  username?: string;

  @Column({ length: 200, comment: '请求地址' })
  url: string;

  @Column({ length: 10, comment: '请求方法' })
  method: string;

  @Column({ type: 'text', nullable: true, comment: '请求参数' })
  params?: string;

  @Column({ type: 'text', nullable: true, comment: '请求体' })
  body?: string;

  @Column({ length: 50, nullable: true, comment: '请求IP' })
  ip?: string;

  @Column({ type: 'int', nullable: true, comment: '响应状态码' })
  statusCode?: number;

  @Column({ type: 'int', default: 0, comment: '耗时(毫秒)' })
  duration: number;

  @CreateDateColumn({ comment: '请求时间' })
  @Transform(({ value }) => formatDate(value))
  createTime: Date;
}
