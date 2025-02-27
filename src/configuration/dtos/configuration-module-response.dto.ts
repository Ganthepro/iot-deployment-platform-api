import { ApiProperty } from '@nestjs/swagger';
import { ModuleConfigurationDocument } from 'src/module-configuration/module-configuration.schema';
import { Module } from 'src/shared/enums/module.enum';

export class ConfigurationModuleResponseDto {
    @ApiProperty({
        type: String,
        description: 'Module ID',
        example: Module.API,
        enum: Module,
    })
    moduleId: Module;

    @ApiProperty({
        type: String,
        description: 'Module tag',
        example: 'v0.5',
    })
    tag: string;

    constructor(moduleConfiguration: ModuleConfigurationDocument) {
        this.moduleId = moduleConfiguration.moduleId;
        this.tag = moduleConfiguration.tag;
    }
}
