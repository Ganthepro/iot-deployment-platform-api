import { Module } from '@nestjs/common';
import { RegistryModule } from 'src/registry/registry.module';
import { DeploymentController } from './deployment.controller';
import { DeploymentService } from './deployment.service';

@Module({
    imports: [RegistryModule],
    controllers: [DeploymentController],
    providers: [DeploymentService],
})
export class DeploymentModule {}
