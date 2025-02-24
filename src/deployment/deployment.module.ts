import { Module } from '@nestjs/common';
import { RegistryModule } from '../registry/registry.module';
import { DeploymentController } from './deployment.controller';
import { DeploymentService } from './deployment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Deployment, DeploymentSchemaFactory } from './deployment.schema';
import { ModuleModule } from 'src/module/module.module';
import { ModuleDeploymentModule } from 'src/module-deployment/module-deployment.module';

@Module({
    imports: [
        RegistryModule,
        MongooseModule.forFeatureAsync([
            {
                name: Deployment.name,
                useFactory: DeploymentSchemaFactory,
            },
        ]),
        ModuleModule,
        ModuleDeploymentModule,
    ],
    controllers: [DeploymentController],
    providers: [DeploymentService],
})
export class DeploymentModule {}
