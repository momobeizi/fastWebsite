import { Controller, Get, Post, Body} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { ApiOperation } from "@nestjs/swagger";
import { AddMenuDto } from "./dto/request/addMenu.dto";


@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }


    @Get('/list')
    @ApiOperation({ summary: '获取菜单列表' })
    getMenuList() {
        return this.menuService.getMenuList()
    }

    @Post('/add')
    @ApiOperation({ summary: '添加菜单' })
    addMenu(@Body() dto: AddMenuDto) {
        return this.menuService.addMenu(dto)
    }

}