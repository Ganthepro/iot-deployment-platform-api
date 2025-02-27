import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import {
    ModuleConfiguration,
    ModuleConfigurationDocument,
} from './module-configuration.schema';

@Injectable()
export class ModuleConfigurationService {
    constructor(
        @InjectModel(ModuleConfiguration.name)
        private readonly ModuleConfigurationModel: Model<ModuleConfigurationDocument>,
    ) {}

    async create(
        module: ModuleConfiguration,
    ): Promise<ModuleConfigurationDocument> {
        return await this.ModuleConfigurationModel.create(module);
    }

    async find(
        filter?: RootFilterQuery<ModuleConfigurationDocument>,
    ): Promise<ModuleConfigurationDocument[]> {
        return await this.ModuleConfigurationModel.find(filter);
    }
}
