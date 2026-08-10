import { Controller, Get, Post, Body, Param} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AddMenuDto } from "./dto/request/addMenu.dto";
import { UpdateMenuDto } from "./dto/request/updateMenu.dto";


@ApiTags('菜单管理')
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

    @Get('get/:id')
    @ApiOperation({ summary: '获取菜单详情' })
    getMenuById(@Param('id') id: number) {
        return this.menuService.getMenuById(id)
    }

    @Post('/update')
    @ApiOperation({ summary: '更新菜单' })
    updateMenu(@Body() dto: UpdateMenuDto) {
        return this.menuService.updateMenu(dto)
    }

    @Get('/delete/:id')
    @ApiOperation({ summary: '删除菜单' })
    deleteMenu(@Param('id') id: number) {
        return this.menuService.deleteMenu(id)
    }

}