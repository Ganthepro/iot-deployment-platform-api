import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeploymentDto {
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
        description: 'configuration id',
        example: 'configuration-1',
        type: String,
    })
    configurationId: string;
}
