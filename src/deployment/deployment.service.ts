import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegistryService } from '../registry/registry.service';
import { ConfigurationContent, Module } from 'azure-iothub';
import {
    DataLoggerAgent,
    IQASensorAgent,
    Postgres,
    RabbitMQ,
} from 'src/shared/configs/modules.config';
import { ModuleConfigurationDto } from './dtos/apply-configuration.dto';
import { Module as ModuleEnum } from 'src/shared/enums/module.enum';

@Injectable()
export class DeploymentService {
    constructor(private readonly registryService: RegistryService) {}

    async getDeployment(deploymentId: string): Promise<ConfigurationContent> {
        try {
            const response =
                await this.registryService.registry.getConfiguration(
                    deploymentId,
                );
            if (response.httpResponse.complete)
                return response.responseBody.content;
            throw new InternalServerErrorException(
                `Failed to get deployment with code ${response.httpResponse.statusCode}`,
            );
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to get deployment with code ${error.message}`,
                );
        }
    }

    async applyConfiguration(
        deviceId: string,
        content: ConfigurationContent,
        modules: ModuleConfigurationDto[],
    ): Promise<void> {
        content.modulesContent.$edgeAgent['properties.desired'].modules =
            this.modulesBuilder(modules);
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

    private modulesBuilder(modules: ModuleConfigurationDto[]) {
        const modulesConfiguration = {};
        modules.forEach((module) => {
            switch (module.moduleId) {
                case ModuleEnum.DataLoggerAgent:
                    modulesConfiguration[ModuleEnum.DataLoggerAgent] =
                        DataLoggerAgent(module.tag, module.status);
                    break;
                case ModuleEnum.IQASensorAgent:
                    modulesConfiguration[ModuleEnum.IQASensorAgent] =
                        IQASensorAgent(module.tag, module.status);
                    break;
                case ModuleEnum.Postgres:
                    modulesConfiguration[ModuleEnum.Postgres] = Postgres(
                        module.status,
                    );
                    break;
                case ModuleEnum.RabbitMQ:
                    modulesConfiguration[ModuleEnum.RabbitMQ] = RabbitMQ(
                        module.status,
                    );
                    break;
                default:
                    throw new InternalServerErrorException(
                        `Module ${module.moduleId} not found`,
                    );
            }
        });
        return modulesConfiguration;
    }
}
