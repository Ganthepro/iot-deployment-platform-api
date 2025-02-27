import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import {
    ModuleConfiguration,
    ModuleConfigurationDocument,
} from './module-configuration.schema';
import { Module } from 'src/shared/enums/module.enum';

@Injectable()
export class ModuleConfigurationService {
    constructor(
        @InjectModel(ModuleConfiguration.name)
        private readonly ModuleConfigurationModel: Model<ModuleConfigurationDocument>,
    ) {}

    async create(
        module: ModuleConfiguration,
    ): Promise<ModuleConfigurationDocument> {
        switch (module.moduleId) {
            case Module.Postgres:
                module.tag = 'alpine3.20';
                break;
            case Module.RabbitMQ:
                module.tag = '4.0-management';
                break;
            default:
                break;
        }
        return await this.ModuleConfigurationModel.create(module);
    }

    async find(
        filter?: RootFilterQuery<ModuleConfigurationDocument>,
    ): Promise<ModuleConfigurationDocument[]> {
        return await this.ModuleConfigurationModel.find(filter);
    }
}
