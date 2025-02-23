import { Device, Registry } from 'azure-iothub';
import {
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';

@Injectable()
export class RegistryService implements OnModuleInit {
    public registry: Registry;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        if (
            this.configService.getOrThrow<boolean>(GLOBAL_CONFIG.IS_DEVELOPMENT)
        )
            this.connect(
                this.configService.getOrThrow<string>(
                    GLOBAL_CONFIG.CONNECTION_STRING,
                ),
            );
    }

    connect(connectionString: string): void {
        this.registry = Registry.fromConnectionString(connectionString);
    }

    async checkConnectivity(): Promise<boolean> {
        try {
            await this.registry.list();
            return true;
        } catch {
            return false;
        }
    }

    async getDevices(): Promise<Device[]> {
        const response = await this.registry.list();
        if (response.httpResponse.complete) return response.responseBody;
        throw new InternalServerErrorException(
            `Failed to list devices with code ${response.httpResponse.statusCode}`,
        );
    }
}
