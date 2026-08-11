import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestLog } from './entities/request-log.entity';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(RequestLog)
    private readonly logRepo: Repository<RequestLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    // 跳过请求日志本身的请求
    if (request.url.startsWith('/api/log')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async () => {
        const duration = Date.now() - startTime;

        try {
          const log = this.logRepo.create({
            userId: request.user?.id,
            username: request.user?.username,
            url: request.url,
            method: request.method,
            params: JSON.stringify(request.query),
            body: JSON.stringify(request.body),
            ip: request.ip === '::1' ? '127.0.0.1' : request.ip || request.socket?.remoteAddress,
            statusCode: 200,
            duration,
          });
          await this.logRepo.insert(log);
        } catch {
          // 记录失败不影响主流程
        }
      }),
    );
  }
}
