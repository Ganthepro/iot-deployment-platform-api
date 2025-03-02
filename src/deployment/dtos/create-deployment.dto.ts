import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateDeploymentDto {
    @IsString({ each: true })
    @IsArray()
    @ApiProperty({
        description: 'device ids',
        example: ['building-a'],
        type: String,
        isArray: true,
    })
    deviceId: string[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'configuration id',
        example: 'configuration-1',
        type: String,
    })
    configurationId: string;
}
