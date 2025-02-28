import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    Configuration as ConfigurationSchema,
    ConfigurationDocument,
} from './configuration.schema';
import { Model, QueryOptions, RootFilterQuery, UpdateQuery } from 'mongoose';
import { ModuleConfigurationDto } from './dtos/create-configuration.dto';
import { Module as ModuleEnum } from '../shared/enums/module.enum';
import {
    API,
    DataLoggerAgent,
    IQASensorAgent,
    Postgres,
    RabbitMQ,
} from 'src/shared/configs/modules.config';
import { RegistryService } from 'src/registry/registry.service';
import { ConfigurationContent } from 'azure-iothub';
import { ModuleConfigurationService } from 'src/module-configuration/module-configuration.service';

@Injectable()
export class ConfigurationService {
    constructor(
        @InjectModel(ConfigurationSchema.name)
        private readonly configurationModel: Model<ConfigurationDocument>,
        private readonly registryService: RegistryService,
        private readonly ModuleConfigurationService: ModuleConfigurationService,
    ) {}

    async update(
        filter: RootFilterQuery<ConfigurationDocument>,
        update: UpdateQuery<ConfigurationDocument>,
        options: QueryOptions<ConfigurationDocument> = { new: true },
    ): Promise<ConfigurationDocument> {
        try {
            return await this.configurationModel.findOneAndUpdate(
                filter,
                update,
                options,
            );
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to update configuration with message: ${error.message}`,
                );
        }
    }

    async getModules(configurationId: string) {
        try {
            return await this.ModuleConfigurationService.find({
                configurationId,
            });
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to get modules with message: ${error.message}`,
                );
        }
    }

    async create(
        content: ConfigurationContent,
        configurationId: string,
    ): Promise<ConfigurationDocument> {
        try {
            const configuration = await this.configurationModel.create({
                configurationId,
            });
            await this.registryService.registry.addConfiguration({
                id: configuration.id,
                content,
                schemaVersion: '1.0',
            });
            return configuration;
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to create configuration with message: ${error.message}`,
                );
        }
    }

    async find(filter?: RootFilterQuery<ConfigurationDocument>) {
        try {
            return await this.configurationModel.find(filter);
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to get configurations with message: ${error.message}`,
                );
        }
    }

    async findOne(
        filter: RootFilterQuery<ConfigurationDocument>,
    ): Promise<ConfigurationDocument> {
        try {
            const configuration = await this.configurationModel.findOne(filter);
            if (!configuration)
                throw new NotFoundException('Configuration not found');
            return configuration;
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to get configuration with message: ${error.message}`,
                );
        }
    }

    async getConfigurationContent(
        configurationId: string,
    ): Promise<ConfigurationContent> {
        try {
            const configuration =
                await this.registryService.registry.getConfiguration(
                    configurationId,
                );
            return configuration.responseBody.content;
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to get configuration content with message: ${error.message}`,
                );
        }
    }

    async createModules(
        modulesConfiguration: ModuleConfigurationDto[],
        configuration: ConfigurationDocument,
    ) {
        try {
            await Promise.all(
                modulesConfiguration.map(async (moduleConfiguration) => {
                    await this.ModuleConfigurationService.create({
                        moduleId: moduleConfiguration.moduleId,
                        tag: moduleConfiguration.tag,
                        configuration,
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

    modulesBuilder(modules: ModuleConfigurationDto[]) {
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
