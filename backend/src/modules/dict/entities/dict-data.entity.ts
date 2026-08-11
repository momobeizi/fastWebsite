import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('dict_data')
export class DictData extends BaseEntity {
  @Column({ length: 50, comment: '字典编码' })
  typeCode: string;

  @Column({ length: 100, comment: '字典标签' })
  label: string;

  @Column({ length: 100, comment: '字典值' })
  value: string;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({ type: 'tinyint', default: 1, comment: '状态 0禁用 1启用' })
  status: number;

  @Column({ length: 200, nullable: true, comment: '备注' })
  remark?: string;
}
