import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectQuery {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Connection string to the IoT Hub',
        example:
            'HostName=iothub-ns-iot-hub-123456-0c12345678.azure-devices.net;SharedAccessKeyName=iothubowner',
        type: String,
    })
    connectionString: string;
}
