import { Controller, Get, Post, Body} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { ApiOperation } from "@nestjs/swagger";
import { AddMenuDto } from "./dto/request/addMenu.dto";


@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }


    @Get('/all')
    @ApiOperation({ summary: '获取所有菜单' })
    getMenuList() {
        return this.menuService.getMenuList()
    }

    @Post('/add')
    @ApiOperation({ summary: '添加菜单' })
    addMenu(@Body() dto: AddMenuDto) {
        return this.menuService.addMenu(dto)
    }

    @Get('/current')
    @ApiOperation({ summary: '获取当前用户菜单' })
    getCurrentUserMenus() {
        return this.menuService.getCurrentUserMenus()
    }

}