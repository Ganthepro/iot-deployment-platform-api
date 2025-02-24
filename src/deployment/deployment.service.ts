import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { RegistryService } from '../registry/registry.service';
import { ConfigurationContent, Module } from 'azure-iothub';
import {
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

@Injectable()
export class DeploymentService {
    constructor(
        @InjectModel(Deployment.name)
        private readonly deploymentModel: Model<DeploymentDocument>,
        private readonly moduleDeploymentService: ModuleDeploymentService,
        private readonly registryService: RegistryService,
        private readonly moduleService: ModuleService,
    ) {}

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
        try {
            content.modulesContent.$edgeAgent['properties.desired'].modules =
                this.modulesBuilder(modules);
            await this.registryService.registry.applyConfigurationContentOnDevice(
                deviceId,
                content,
            );
            const deployment = await this.deploymentModel.create({
                deviceId,
                status: DeploymentStatus.Success,
            });
            await this.createModules(modules, deployment);
        } catch (error) {
            await this.deploymentModel.create({
                deviceId,
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
                        module: module,
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
                        DataLoggerAgent(module.tag, module.status);
                    break;
                case ModuleEnum.IQASensorAgent:
                    modulesConfiguration[ModuleEnum.IQASensorAgent] =
                        IQASensorAgent(module.tag, module.status);
                    break;
                case ModuleEnum.Postgres:
                    modulesConfiguration[ModuleEnum.Postgres] = Postgres(
                        module.tag,
                        module.status,
                    );
                    break;
                case ModuleEnum.RabbitMQ:
                    modulesConfiguration[ModuleEnum.RabbitMQ] = RabbitMQ(
                        module.tag,
                        module.status,
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
