import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('dict_type')
export class DictType extends BaseEntity {
  @Column({ length: 50, comment: '字典名称' })
  name: string;

  @Column({ length: 50, unique: true, comment: '字典编码' })
  code: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态 0禁用 1启用' })
  status: number;

  @Column({ length: 200, nullable: true, comment: '备注' })
  remark?: string;
}
