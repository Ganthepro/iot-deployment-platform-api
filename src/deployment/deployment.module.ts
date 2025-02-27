import { Module } from '@nestjs/common';
import { RegistryModule } from '../registry/registry.module';
import { DeploymentController } from './deployment.controller';
import { DeploymentService } from './deployment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Deployment, DeploymentSchemaFactory } from './deployment.schema';
import { ModuleConfigurationModule } from '../module-configuration/module-configuration.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';

@Module({
    imports: [
        RegistryModule,
        MongooseModule.forFeatureAsync([
            {
                name: Deployment.name,
                useFactory: DeploymentSchemaFactory,
            },
        ]),
        ModuleConfigurationModule,
        ConfigurationModule,
    ],
    controllers: [DeploymentController],
    providers: [DeploymentService],
})
export class DeploymentModule {}
