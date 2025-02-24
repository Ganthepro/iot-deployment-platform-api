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
    @IsNotEmpty()
    @ApiProperty({
        description: 'image tag',
        example: 'latest',
        type: String,
    })
    tag: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        description: 'module version',
        example: 'running',
        type: String,
    })
    status?: 'running' | 'stopped';
}

export class ApplyConfigurationDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'device id',
        example: 'building-a',
        type: String,
    })
    deviceId: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'deployment id',
        example: 'base-template',
        type: String,
    })
    baseTemplatedeploymentId: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({
        description: 'module configurations',
        type: ModuleConfigurationDto,
        isArray: true,
        examples: [
            {
                moduleId: 'data-logger-agent',
                tag: 'latest',
            },
            {
                moduleId: 'rabbitmq',
                tag: '4.0-management',
            },
            {
                moduleId: 'iaq-sensor-agent',
                tag: 'latest',
            },
            {
                moduleId: 'postgres',
                tag: 'alpine3.20',
            },
        ],
    })
    @ValidateNested({ each: true })
    @Type(() => ModuleConfigurationDto)
    @IsUniqueModuleId()
    modules: ModuleConfigurationDto[];
}
