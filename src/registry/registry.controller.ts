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
import { Device } from 'azure-iothub';

@Controller('registry')
@Injectable()
@ApiTags('registry')
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
        type: Device,
        isArray: true,
    })
    async getDevices() {
        return await this.registryService.getDevices();
    }
}
