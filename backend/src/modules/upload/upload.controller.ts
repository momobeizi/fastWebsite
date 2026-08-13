import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// 上传目录
const UPLOAD_DIR = join(process.cwd(), 'uploads');

// 生成日期目录，如 uploads/2026-08-13/
const getDateDir = (): string => {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dateDir = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const fullDir = join(UPLOAD_DIR, dateDir);
  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir, { recursive: true });
  }
  return fullDir;
};

@ApiTags('文件上传')
@Controller('common')
export class UploadController {
  @ApiOperation({ summary: '上传图片' })
  @Post('/uploadFile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, getDateDir());
        },
        filename: (_req, file, cb) => {
          // 用时间戳+随机数+原始扩展名命名
          const now = new Date();
          const pad = (n: number) => n.toString().padStart(2, '0');
          const timeStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${now.getMilliseconds().toString().padStart(3, '0')}`;
          const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          const ext = extname(file.originalname).toLowerCase();
          cb(null, `${timeStr}_${random}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        // 只允许图片
        const allowedMime = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (allowedMime.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('只支持上传图片文件'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }
    // 构造可访问的 URL，如 /uploads/2026-08-13/xxx.png
    const url = file.path
      .replace(/\\/g, '/')
      .replace(process.cwd().replace(/\\/g, '/'), '');
    return url;
  }
}
