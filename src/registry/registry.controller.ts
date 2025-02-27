import {
    Controller,
    Get,
    Head,
    HttpCode,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { RegistryService } from './registry.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeviceResponseDto } from './dtos/device-response.dto';

@Controller('registry')
@Injectable()
@ApiTags('Registry')
export class RegistryController {
    constructor(private readonly registryService: RegistryService) {}

    @Head()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'check connectivity',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async checkConnectivity() {
        return await this.registryService.checkConnectivity();
    }

    @Get('device')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'list all devices',
        type: DeviceResponseDto,
        isArray: true,
    })
    async getDevices() {
        const device = await this.registryService.getDevices();
        return device.map((device) => new DeviceResponseDto(device));
    }
}
