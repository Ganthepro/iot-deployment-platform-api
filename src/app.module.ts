import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { dotenvConfig } from './shared/configs/dotenv.config';
import { RegistryModule } from './registry/registry.module';
import { DeploymentModule } from './deployment/deployment.module';
import { APP_GUARD } from '@nestjs/core';
import { ConnectivityGuard } from './registry/guards/connectivity.guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: dotenvConfig,
            validationOptions: {
                abortEarly: true,
            },
        }),
        RegistryModule,
        DeploymentModule,
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
