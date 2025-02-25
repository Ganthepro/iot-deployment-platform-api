import { Device, Registry } from 'azure-iothub';
import {
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
    ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';

@Injectable()
export class RegistryService implements OnModuleInit {
    public registry: Registry;

    constructor(private readonly configService: ConfigService) {}

    onModuleInit() {
        this.connect(
            this.configService.getOrThrow<string>(
                GLOBAL_CONFIG.CONNECTION_STRING,
            ),
        );
    }

    private connect(connectionString: string): void {
        try {
            this.registry = Registry.fromConnectionString(connectionString);
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(error.message);
        }
    }

    async checkConnectivity(): Promise<void> {
        try {
            await this.registry.list();
        } catch {
            throw new ServiceUnavailableException(
                'Failed to connect to registry',
            );
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
