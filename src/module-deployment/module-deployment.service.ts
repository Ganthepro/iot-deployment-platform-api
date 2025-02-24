import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    ModuleDeployment,
    ModuleDeploymentDocument,
} from '../module-deployment/module-deployment.schema';

@Injectable()
export class ModuleDeploymentService {
    constructor(
        @InjectModel(ModuleDeployment.name)
        private readonly moduleDeploymentModel: Model<ModuleDeploymentDocument>,
    ) {}

    async create(module: ModuleDeployment): Promise<ModuleDeploymentDocument> {
        return await this.moduleDeploymentModel.create(module);
    }
}
