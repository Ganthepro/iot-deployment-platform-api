import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { DeviceDocument, Device } from './device.schema';
import { RegistryService } from '../registry/registry.service';

@Injectable()
export class DeviceService implements OnModuleInit {
    constructor(
        @InjectModel(Device.name)
        private readonly deviceModel: Model<DeviceDocument>,
        private readonly registryService: RegistryService,
    ) {}

    async onModuleInit() {
        const devices = await this.registryService.getDevices();
        devices.forEach(async (device) => {
            try {
                await this.create({
                    deviceId: device.deviceId,
                });
            } catch {}
        });
    }

    async create(device: Device): Promise<Device> {
        return await this.deviceModel.create(device);
    }

    async findOne(
        filter: RootFilterQuery<DeviceDocument>,
    ): Promise<DeviceDocument> {
        try {
            return await this.deviceModel.findOne(filter);
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException(
                    `Failed to find device with code ${error.message}`,
                );
            }
        }
    }

    async findAll(): Promise<DeviceDocument[]> {
        try {
            return await this.deviceModel.find();
        } catch (error) {
            if (error instanceof Error) {
                throw new NotFoundException(
                    `Failed to find devices with code ${error.message}`,
                );
            }
        }
    }
}
