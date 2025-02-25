import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as ModuleSchema, ModuleSchemaFactory } from './module.schema';
import { ModuleService } from './module.service';
import { DeviceModule } from '../device/device.module';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: ModuleSchema.name,
                useFactory: ModuleSchemaFactory,
            },
        ]),
        DeviceModule,
    ],
    providers: [ModuleService],
    exports: [ModuleService],
})
export class ModuleModule {}
