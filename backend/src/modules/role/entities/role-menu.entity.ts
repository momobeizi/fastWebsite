import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('role_menu')
export class RoleMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', comment: '角色ID' })
  roleId: number;

  @Column({ type: 'int', comment: '菜单ID' })
  menuId: number;
}
