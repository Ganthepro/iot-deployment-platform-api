import { DeploymentStatus } from '../enums/deployment-status.enum';
import { DeploymentDocument } from '../deployment.schema';
import { ApiProperty } from '@nestjs/swagger';

export class DeploymentResponseDto {
    @ApiProperty({
        type: String,
        description: 'Deployment Id',
        example: '60e4b4d4d1c7f0001f000001',
    })
    id: string;

    @ApiProperty({
        type: String,
        description: 'Device Ids',
        example: ['building-a'],
        isArray: true,
    })
    deviceId: string[];

    @ApiProperty({
        type: String,
        description: 'Configuration Id',
        example: 'configuration-1',
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
        type: String,
        description: 'Deployment message',
        example: 'Deployment failed',
    })
    message?: string;

    @ApiProperty({
        type: Date,
        description: 'Deployment creation date',
        example: new Date(),
    })
    createdAt: Date;

    constructor(deployment: DeploymentDocument) {
        this.id = deployment.id;
        this.deviceId = deployment.deviceId;
        this.configurationId = deployment.configuration.configurationId;
        this.status = deployment.status;
        this.createdAt = deployment.createdAt;
        this.message = deployment.message;
    }
}
