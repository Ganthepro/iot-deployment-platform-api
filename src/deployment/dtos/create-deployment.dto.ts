import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateDeploymentDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'device id',
        example: 'building-a',
        type: String,
    })
    deviceId: string;

    @IsMongoId()
    @IsNotEmpty()
    @ApiProperty({
        description: 'configuration id',
        example: '60f0c5c7f6b8b2b4b3b5b6b7',
        type: String,
    })
    configuration: string;
}
