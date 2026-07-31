
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { knife4jSetup } from 'nestjs-knife4j-plus'

export function swaggerConfig(app) {
    const config = new DocumentBuilder()
        .setTitle('fast-website')
        .setDescription('fast-website接口文档')
        .setVersion('1.0')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    // 启用knife4j增强（关键代码）
    knife4jSetup(app, [
        {
            name: '2.0 version', // 文档版本名称
            url: `/api-json`,    // Swagger openapi JSON地址
        },
    ])
}