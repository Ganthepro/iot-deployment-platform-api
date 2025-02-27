import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    ModuleConfiguration,
    ModuleConfigurationSchemaFactory,
} from './module-configuration.schema';
import { ModuleConfigurationService } from './module-configuration.service';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: ModuleConfiguration.name,
                useFactory: ModuleConfigurationSchemaFactory,
            },
        ]),
    ],
    providers: [ModuleConfigurationService],
    exports: [ModuleConfigurationService],
})
export class ModuleConfigurationModule {}
