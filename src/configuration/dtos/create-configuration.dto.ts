import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { IsUniqueModuleId } from 'src/shared/decorators/is-unique-module-id.decorator';
import { Module } from 'src/shared/enums/module.enum';

export class ModuleConfigurationDto {
    @IsEnum(Module)
    @IsNotEmpty()
    @ApiProperty({
        description: 'module id',
        example: Module.DataLoggerAgent,
        type: String,
        enum: Module,
    })
    moduleId: Module;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'image tag',
        example: 'latest',
        type: String,
    })
    tag?: string;
}

export class CreateConfigurationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'deployment id',
        example: 'base-template',
        type: String,
    })
    baseTemplateConfigurationId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'configuration id',
        example: 'configuration-1',
        type: String,
    })
    configurationId: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({
        description: 'module configurations',
        type: ModuleConfigurationDto,
        isArray: true,
        examples: [
            {
                moduleId: 'data-logger',
                tag: 'latest',
            },
            {
                moduleId: 'rabbitmq',
            },
            {
                moduleId: 'iaq-sensor',
                tag: 'latest',
            },
            {
                moduleId: 'api',
                tag: 'latest',
            },
            {
                moduleId: 'postgres',
            },
        ],
    })
    @ValidateNested({ each: true })
    @Type(() => ModuleConfigurationDto)
    @IsUniqueModuleId()
    modules: ModuleConfigurationDto[];
}
