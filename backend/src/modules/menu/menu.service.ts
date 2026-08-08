import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Menu } from "./entities/menu.entity";
import { AddMenuDto } from "./dto/request/addMenu.dto";
import { arrayToTree } from "src/common/utils";

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepo: Repository<Menu>,
    ) { }

    async getMenuList() {
        return await this.menuRepo.find()
    }

    // 添加菜单
    async addMenu(dto: AddMenuDto) {
        return await this.menuRepo.insert(dto)
    }

    //获取当前用户拥有的菜单
    async getCurrentUserMenus() {
        const menuList = await this.menuRepo.find({ where: { status: 1 } })
        return arrayToTree(menuList, 'id', 'parentId', 'children')
    }
}