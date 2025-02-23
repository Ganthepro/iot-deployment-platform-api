import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { GLOBAL_CONFIG } from './shared/constants/global-config.constant';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const configService = new ConfigService();

    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            disableErrorMessages: !configService.getOrThrow<boolean>(
                GLOBAL_CONFIG.IS_DEVELOPMENT,
            ),
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors({
        origin: configService.getOrThrow<string>(
            GLOBAL_CONFIG.CORS_ALLOW_ORIGIN,
        ),
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
        optionsSuccessStatus: HttpStatus.OK,
        exposedHeaders: 'Authorization',
    });

    if (configService.getOrThrow<string>(GLOBAL_CONFIG.IS_DEVELOPMENT)) {
        const config = new DocumentBuilder()
            .addBearerAuth()
            .setTitle('NextGen AI Camp API')
            .setDescription('This is the NextGen AI Camp API documentation')
            .setVersion('dev')
            .build();
        const documentFactory = () => SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('docs', app, documentFactory);
    }

    await app.listen(
        configService.getOrThrow<string>(GLOBAL_CONFIG.PORT) ?? 3000,
    );
}
bootstrap();
