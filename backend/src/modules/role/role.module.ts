import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { RoleMenu } from "./entities/role-menu.entity";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";


@Module({
    imports: [
        TypeOrmModule.forFeature([Role]),
        TypeOrmModule.forFeature([RoleMenu]),
    ],
    providers: [RoleService],
    exports: [RoleService],
    controllers: [RoleController]
})

export class RoleModule { }