import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ModuleConfigurationDto } from 'src/configuration/dtos/create-configuration.dto';
import { IsUniqueModuleId } from 'src/shared/decorators/is-unique-module-id.decorator';

export class AutoUpdateDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'deployment id',
        example: 'base-template',
        type: String,
    })
    baseTemplateConfigurationId: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({
        description: 'module configurations',
        type: ModuleConfigurationDto,
        isArray: true,
    })
    @ValidateNested({ each: true })
    @Type(() => ModuleConfigurationDto)
    @IsUniqueModuleId()
    modules: ModuleConfigurationDto[];

    @ApiProperty({
        description: 'device id',
        example: ['building-a', 'building-b'],
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    deviceId: string[];
}
