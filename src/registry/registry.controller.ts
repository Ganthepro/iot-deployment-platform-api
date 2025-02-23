import {
    BadGatewayException,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Injectable,
    Query,
} from '@nestjs/common';
import { RegistryService } from './registry.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConnectQuery } from './dtos/connect-query.dto';
import { Standalone } from 'src/shared/decorators/standalone.decorator';
import { Device } from 'azure-iothub';

@Controller('registry')
@Injectable()
@ApiTags('registry')
export class RegistryController {
    constructor(private readonly registryService: RegistryService) {}

    @Get('connect')
    @Standalone()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'connect to the registry',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async connect(@Query() query: ConnectQuery) {
        this.registryService.connect(query.connectionString);
        const connectivity = this.registryService.checkConnectivity();
        if (!connectivity)
            throw new BadGatewayException('IoT Hub is not available');
        return;
    }

    @Get('device')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'list all devices',
        type: Device,
        isArray: true,
    })
    async getDevices() {
        return await this.registryService.getDevices();
    }
}
