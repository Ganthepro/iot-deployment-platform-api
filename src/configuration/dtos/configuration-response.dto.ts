import { ApiProperty } from '@nestjs/swagger';
import { ConfigurationDocument } from '../configuration.schema';
import { ConfigurationStatus } from '../enums/configuration-status.enum';

export class ConfigurationResponseDto {
    @ApiProperty({
        description: 'Configuration ID',
        example: '60e4b4d4d1c7f0001f000001',
        type: String,
    })
    id: string;

    @ApiProperty({
        description: 'status of the configuration',
        example: ConfigurationStatus.Undeployed,
        enum: ConfigurationStatus,
        type: String,
    })
    status: ConfigurationStatus;

    @ApiProperty({
        description: 'Configuration Id',
        example: new Date(),
        type: Date,
    })
    configurationId: string;

    constructor(configuration: ConfigurationDocument) {
        this.id = configuration.id;
        this.status = configuration.status;
        this.configurationId = configuration.configurationId;
    }
}
