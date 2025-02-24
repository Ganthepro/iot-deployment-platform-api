import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModuleDocument, Module as ModuleSchema } from './module.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { Module } from 'src/shared/enums/module.enum';

@Injectable()
export class ModuleService implements OnModuleInit {
    constructor(
        @InjectModel(ModuleSchema.name)
        private readonly moduleModel: Model<ModuleDocument>,
    ) {}

    async onModuleInit() {
        Object.values(Module).forEach(async (module) => {
            await this.create({
                moduleId: module,
            });
        });
    }

    async create(module: Partial<ModuleSchema>): Promise<ModuleDocument> {
        return await this.moduleModel.create(module);
    }

    async findOne(
        filter: RootFilterQuery<ModuleDocument>,
    ): Promise<ModuleDocument> {
        try {
            return await this.moduleModel.findOne(filter);
        } catch (error) {
            if (error instanceof Error)
                throw new NotFoundException(error.message);
        }
    }
}
