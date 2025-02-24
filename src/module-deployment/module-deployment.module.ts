import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    ModuleDeployment,
    ModuleDeploymentSchemaFactory,
} from './module-deployment.schema';
import { ModuleDeploymentService } from './module-deployment.service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: ModuleDeployment.name,
                useFactory: ModuleDeploymentSchemaFactory,
            },
        ]),
    ],
    providers: [ModuleDeploymentService],
    exports: [ModuleDeploymentService],
})
export class ModuleDeploymentModule {}
