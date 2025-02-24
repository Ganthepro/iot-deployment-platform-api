import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
        example: 'infrastucture',
        type: String,
    })
    deploymentId: string;
}
