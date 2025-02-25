import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchemaFactory } from './device.schema';
import { DeviceService } from './device.service';
import { RegistryModule } from 'src/registry/registry.module';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Device.name,
                useFactory: DeviceSchemaFactory,
            },
        ]),
        RegistryModule,
    ],
    providers: [DeviceService],
    exports: [DeviceService],
})
export class DeviceModule {}
