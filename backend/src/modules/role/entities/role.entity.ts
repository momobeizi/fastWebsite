import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity('role')
export class Role extends BaseEntity {
  @Column({ length: 50, comment: '角色名称' })
  name: string;

  @Column({ length: 50, unique: true, comment: '角色编码' })
  code: string;

  @Column({ length: 200, nullable: true, comment: '角色描述' })
  description?: string;

  @Column({ type: 'tinyint', default: 1, comment: '状态 0禁用 1启用' })
  status: number;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

}