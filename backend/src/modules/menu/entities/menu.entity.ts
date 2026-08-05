import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity('menu')
export class Menu extends BaseEntity {
    @Column({ length: 50, comment: '菜单名称' })
    name: string

    @Column({ length: 100, comment: '菜单路径' })
    path?: string

    @Column({ length: 100, comment: '菜单组件' })
    component?: string

    @Column({ length: 50, comment: '菜单图标', nullable: true })
    icon?: string

    @Column({ type: 'int', nullable: true, comment: '父级id' })
    parentId?: number

    @Column({ type: 'tinyint', default: 0, comment: '状态 0禁用 1启用' })
    status: number

    @Column({ length: 255, comment: '菜单权限' })
    permission: string

    @Column({ type: 'tinyint', default: 0, comment: '菜单类型 0目录 1菜单 2按钮' })
    type: number

    @Column({ type: 'tinyint', default: 0, comment: '排序' })
    sort: number

    @Column({ type: 'tinyint', default: 0, comment: '是否外链 0否 1是' })
    isLink: number

    @Column({ type: 'tinyint', default: 0, comment: '是否显示 0否 1是' })
    visible: number

    @Column({ type: 'tinyint', default: 0, comment: '是否缓存 0否 1是' })
    keepAlive: number
}