import { ApiProperty } from '@nestjs/swagger';
import { Device } from 'azure-iothub';

export class DeviceResponseDto {
    @ApiProperty({
        type: String,
        description: 'Device Id',
        example: 'building-a',
    })
    deviceId: string;

    @ApiProperty({
        type: String,
        description: 'Connection state',
        example: 'connected',
    })
    connectionState: Device.ConnectionState;

    constructor(device: Device) {
        this.deviceId = device.deviceId;
        this.connectionState = device.connectionState;
    }
}
