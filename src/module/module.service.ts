import {
    Injectable,
    NotFoundException,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModuleDocument, Module as ModuleSchema } from './module.schema';
import { Model, RootFilterQuery } from 'mongoose';
import { Module } from 'src/shared/enums/module.enum';
import { DeviceService } from 'src/device/device.service';

@Injectable()
export class ModuleService implements OnApplicationBootstrap {
    constructor(
        @InjectModel(ModuleSchema.name)
        private readonly moduleModel: Model<ModuleDocument>,
        private readonly deviceService: DeviceService,
    ) {}

    async onApplicationBootstrap() {
        const devices = await this.deviceService.findAll();
        devices.forEach(async (device) => {
            Object.values(Module).forEach(async (module) => {
                await this.create({
                    moduleId: module,
                    device,
                });
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

    async updateTags(moduleId: string, tags: string[]): Promise<void> {
        try {
            await this.moduleModel.updateOne({ moduleId }, { tags });
        } catch (error) {
            if (error instanceof Error)
                throw new NotFoundException(error.message);
        }
    }
}
