import { Module } from '@nestjs/common';
import { ContainerController } from './container.controller';
import { ContainerService } from './container.service';
import { ModuleModule } from '../module/module.module';

@Module({
    imports: [ModuleModule],
    controllers: [ContainerController],
    providers: [ContainerService],
    exports: [ContainerService],
})
export class ContainerModule {}
