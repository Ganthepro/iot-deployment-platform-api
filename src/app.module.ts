import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dotenvConfig } from './shared/configs/dotenv.config';
import { RegistryModule } from './registry/registry.module';
import { DeploymentModule } from './deployment/deployment.module';
import { APP_GUARD } from '@nestjs/core';
import { ConnectivityGuard } from './registry/guards/connectivity.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { GLOBAL_CONFIG } from './shared/constants/global-config.constant';
import { ModuleDeploymentModule } from './module-deployment/module-deployment.module';
import { ModuleModule } from './module/module.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: dotenvConfig,
            validationOptions: {
                abortEarly: true,
            },
        }),
        MongooseModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                uri: configService.getOrThrow<string>(GLOBAL_CONFIG.MONGO_URI),
            }),
            inject: [ConfigService],
        }),
        RegistryModule,
        DeploymentModule,
        ModuleDeploymentModule,
        ModuleModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ConnectivityGuard,
        },
    ],
})
export class AppModule {}
