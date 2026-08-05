import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Menu } from "./entities/menu.entity";
import { AddMenuDto } from "./dto/request/addMenu.dto";

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
        const result = await this.menuRepo.insert(dto)
       return result
    }
}