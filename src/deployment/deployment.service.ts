import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegistryService } from '../registry/registry.service';
import { ConfigurationContent, Module } from 'azure-iothub';

@Injectable()
export class DeploymentService {
    constructor(private readonly registryService: RegistryService) {}

    async applyConfiguration(
        deviceId: string,
        content: ConfigurationContent,
    ): Promise<void> {
        const response =
            await this.registryService.registry.applyConfigurationContentOnDevice(
                deviceId,
                content,
            );
        if (!response.httpResponse.complete)
            throw new InternalServerErrorException(
                `Failed to apply configuration with code ${response.httpResponse.statusCode}`,
            );
    }

    async getModules(deviceId: string): Promise<Module[]> {
        const response =
            await this.registryService.registry.getModulesOnDevice(deviceId);
        if (response.httpResponse.complete) return response.responseBody;
        throw new InternalServerErrorException(
            `Failed to get configurations with code ${response.httpResponse.statusCode}`,
        );
    }
}
