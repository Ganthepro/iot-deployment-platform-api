import { Device, Registry } from 'azure-iothub';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RegistryService {
    private registry: Registry;

    constructor() {}

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
        console.log(response.responseBody);
        return response.responseBody;
    }
}
