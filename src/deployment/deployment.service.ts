import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { RegistryService } from '../registry/registry.service';
import { ConfigurationContent, Module } from 'azure-iothub';
import {
    API,
    DataLoggerAgent,
    IQASensorAgent,
    Postgres,
    RabbitMQ,
} from 'src/shared/configs/modules.config';
import { ModuleConfigurationDto } from './dtos/apply-configuration.dto';
import { Module as ModuleEnum } from '../shared/enums/module.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Deployment, DeploymentDocument } from './deployment.schema';
import { Model } from 'mongoose';
import { DeploymentStatus } from './enums/deployment-status.enum';
import { ModuleDeploymentService } from 'src/module-deployment/module-deployment.service';
import { ModuleService } from 'src/module/module.service';
import { DeviceService } from 'src/device/device.service';

@Injectable()
export class DeploymentService {
    constructor(
        @InjectModel(Deployment.name)
        private readonly deploymentModel: Model<DeploymentDocument>,
        private readonly moduleDeploymentService: ModuleDeploymentService,
        private readonly registryService: RegistryService,
        private readonly moduleService: ModuleService,
        private readonly deviceService: DeviceService,
    ) {}

    async autoUpdateConfiguration(): Promise<void> {
        try {
            await this.deviceService.findAll();
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to auto update configuration with message: ${error.message}`,
                );
        }
    }

    async getDeployment(deploymentId: string): Promise<ConfigurationContent> {
        try {
            const response =
                await this.registryService.registry.getConfiguration(
                    deploymentId,
                );
            return response.responseBody.content;
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
        const device = await this.deviceService.findOne({ deviceId });
        try {
            content.modulesContent.$edgeAgent['properties.desired'].modules =
                this.modulesBuilder(modules);
            await this.registryService.registry.applyConfigurationContentOnDevice(
                deviceId,
                content,
            );
            const deployment = await this.deploymentModel.create({
                device,
                status: DeploymentStatus.Success,
            });
            await this.createModules(modules, deployment);
        } catch (error) {
            await this.deploymentModel.create({
                device,
                status: DeploymentStatus.Failure,
            });
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to apply configuration with message: ${error.message}`,
                );
        }
    }

    async getModules(deviceId: string): Promise<Module[]> {
        try {
            const response =
                await this.registryService.registry.getModulesOnDevice(
                    deviceId,
                );
            return response.responseBody;
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to get configurations with message: ${error.message}`,
                );
        }
    }

    async createModules(
        modulesConfiguration: ModuleConfigurationDto[],
        deployment: DeploymentDocument,
    ) {
        try {
            await Promise.all(
                modulesConfiguration.map(async (moduleConfiguration) => {
                    const module = await this.moduleService.findOne({
                        moduleId: moduleConfiguration.moduleId,
                    });
                    await this.moduleDeploymentService.create({
                        module,
                        tag: moduleConfiguration.tag,
                        deployment,
                    });
                }),
            );
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to create modules with message: ${error.message}`,
                );
        }
    }

    private modulesBuilder(modules: ModuleConfigurationDto[]) {
        const modulesConfiguration = {};
        modules.forEach(async (module) => {
            switch (module.moduleId) {
                case ModuleEnum.DataLoggerAgent:
                    modulesConfiguration[ModuleEnum.DataLoggerAgent] =
                        DataLoggerAgent(module.status, module.tag);
                    break;
                case ModuleEnum.IQASensorAgent:
                    modulesConfiguration[ModuleEnum.IQASensorAgent] =
                        IQASensorAgent(module.status, module.tag);
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
                case ModuleEnum.API:
                    modulesConfiguration[ModuleEnum.API] = API(
                        module.status,
                        module.tag,
                    );
                    break;
                default:
                    throw new BadRequestException(
                        `Module ${module.moduleId} not found`,
                    );
            }
        });
        return modulesConfiguration;
    }
}
