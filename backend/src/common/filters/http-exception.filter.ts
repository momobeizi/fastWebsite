// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      // NestJS 自带格式: { message: "xxx", error: "Bad Request", statusCode: 400 }
      // 字符串格式: "xxx"
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const msg = (res as any).message;
        // class-validator 校验失败时 message 是数组，取第一个
        message = Array.isArray(msg) ? msg[0] : msg;
      }
    }

    response.status(status).json({
      code: status,
      message,
      data: null,
    });
  }
}
