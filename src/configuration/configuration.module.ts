import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Configuration,
    ConfigurationSchemaFactory,
} from './configuration.schema';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationService } from './configuration.service';
import { RegistryModule } from 'src/registry/registry.module';
import { ModuleConfigurationModule } from 'src/module-configuration/module-configuration.module';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Configuration.name,
                useFactory: ConfigurationSchemaFactory,
            },
        ]),
        RegistryModule,
        ModuleConfigurationModule,
    ],
    controllers: [ConfigurationController],
    providers: [ConfigurationService],
    exports: [ConfigurationService],
})
export class ConfigurationModule {}
