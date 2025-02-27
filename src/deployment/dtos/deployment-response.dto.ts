import { DeploymentStatus } from '../enums/deployment-status.enum';
import { DeploymentDocument } from '../deployment.schema';
import { ApiProperty } from '@nestjs/swagger';

export class DeploymentResponseDto {
    @ApiProperty({
        type: String,
        description: 'Device Id',
        example: 'building-a',
    })
    deviceId: string;

    @ApiProperty({
        type: String,
        description: 'Configuration Id',
        example: '60e4b4d4d1c7f0001f000001',
    })
    configurationId: string;

    @ApiProperty({
        type: String,
        description: 'Deployment status',
        example: DeploymentStatus.Success,
        enum: DeploymentStatus,
    })
    status: DeploymentStatus;

    @ApiProperty({
        type: Boolean,
        description: 'Is deployment used',
        example: false,
    })
    isLatest: boolean;

    @ApiProperty({
        type: Date,
        description: 'Deployment creation date',
        example: new Date(),
    })
    createdAt: Date;

    constructor(deployment: DeploymentDocument) {
        this.deviceId = deployment.device.deviceId;
        this.configurationId = deployment.configuration;
        this.status = deployment.status;
        this.isLatest = deployment.isLatest;
        this.createdAt = deployment.createdAt;
    }
}
