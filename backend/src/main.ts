import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { swaggerConfig } from './config/swagger';
import { ConfigService } from '@nestjs/config'
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  // app.set('trust proxy', true); // 信任代理，使 req.ip 拿到真实 IP
  swaggerConfig(app); //初始化 swagger
  const configService = app.get(ConfigService)
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionsFilter());
  // 暂时关闭，排查问题
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = configService.getOrThrow<number>('PORT')
  await app.listen(port);
  console.log(`服务已启动可访问：http://localhost:${port}`)
}
bootstrap();
