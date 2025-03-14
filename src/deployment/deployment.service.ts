import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Deployment, DeploymentDocument } from './deployment.schema';
import { Model, QueryOptions, RootFilterQuery, UpdateQuery } from 'mongoose';
import { DeploymentStatus } from './enums/deployment-status.enum';

@Injectable()
export class DeploymentService {
    constructor(
        @InjectModel(Deployment.name)
        private readonly deploymentModel: Model<DeploymentDocument>,
    ) {}

    async create(
        deviceId: string[],
        status: DeploymentStatus,
        configuration: string,
        isLatest: boolean = true,
        message: string = null,
    ): Promise<DeploymentDocument> {
        try {
            return await this.deploymentModel.create({
                status,
                deviceId,
                configuration,
                isLatest,
                message,
            });
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to create deployment with message: ${error.message}`,
                );
        }
    }

    async update(
        filter: RootFilterQuery<DeploymentDocument>,
        update: UpdateQuery<DeploymentDocument>,
        options: QueryOptions<DeploymentDocument> = { new: true },
    ): Promise<DeploymentDocument> {
        try {
            return await this.deploymentModel.findOneAndUpdate(
                filter,
                update,
                options,
            );
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to update deployment with message: ${error.message}`,
                );
        }
    }

    async find(
        filter?: RootFilterQuery<DeploymentDocument>,
    ): Promise<DeploymentDocument[]> {
        try {
            return await this.deploymentModel
                .find(filter)
                .sort({ createdAt: -1 });
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to find deployments with message: ${error.message}`,
                );
        }
    }

    async findOne(
        filter: RootFilterQuery<DeploymentDocument>,
    ): Promise<DeploymentDocument> {
        try {
            const deployment = await this.deploymentModel.findOne(filter);
            if (!deployment)
                throw new NotFoundException('Deployment not found');
            return deployment;
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to find deployment with message: ${error.message}`,
                );
        }
    }
}
