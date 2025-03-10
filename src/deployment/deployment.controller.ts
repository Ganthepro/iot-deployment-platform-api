import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeploymentService } from './deployment.service';
import { CreateDeploymentDto } from './dtos/create-deployment.dto';
import { ObjectId } from 'src/shared/decorators/object-id.decorator';
import { DeploymentResponseDto } from './dtos/deployment-response.dto';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { RegistryService } from 'src/registry/registry.service';
import { DeploymentStatus } from './enums/deployment-status.enum';
import { ConfigurationStatus } from 'src/configuration/enums/configuration-status.enum';
import { AutoUpdateDto } from './dtos/auto-update.dto';
import { v4 } from 'uuid';

@Injectable()
@Controller('deployment')
@ApiTags('Deployment')
export class DeploymentController {
    constructor(
        private readonly deploymentService: DeploymentService,
        private readonly configurationService: ConfigurationService,
        private readonly registryService: RegistryService,
    ) {}

    @Post('auto-update')
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'auto update deployment',
    })
    async autoUpdate(@Body() autoUpdateDto: AutoUpdateDto): Promise<void> {
        const uuid = v4();
        const modules = autoUpdateDto.modules;
        const content = await this.configurationService.getConfigurationContent(
            autoUpdateDto.baseTemplateConfigurationId,
        );
        content.modulesContent.$edgeAgent['properties.desired'].modules =
            this.configurationService.modulesBuilder(modules);
        const configurations = await this.configurationService.create(
            null,
            `auto-update-${uuid}`,
        );
        await this.configurationService.createModules(modules, configurations);
        try {
            await Promise.all(
                autoUpdateDto.deviceId.map(async (deviceId) => {
                    this.registryService.registry.applyConfigurationContentOnDevice(
                        deviceId,
                        content,
                    );
                    await this.deploymentService.update(
                        {
                            isLatest: true,
                            deviceId: {
                                $in: [deviceId],
                            },
                        },
                        {
                            isLatest: false,
                        },
                    );
                }),
            );
            await this.deploymentService.create(
                autoUpdateDto.deviceId,
                DeploymentStatus.Success,
                configurations.id,
            );
            await this.configurationService.update(
                { _id: configurations.id },
                { status: ConfigurationStatus.Deployed },
            );
        } catch (error) {
            await this.deploymentService.create(
                autoUpdateDto.deviceId,
                DeploymentStatus.Failure,
                configurations.id,
                false,
            );
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to apply configuration with message: ${error.message}`,
                );
        }
    }

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'list all deployments',
        isArray: true,
        type: DeploymentResponseDto,
    })
    async getDeployments(): Promise<DeploymentResponseDto[]> {
        const deployments = await this.deploymentService.find();
        return deployments.map(
            (deployment) => new DeploymentResponseDto(deployment),
        );
    }

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'get deployment',
        type: DeploymentResponseDto,
    })
    @ApiParam({
        name: 'id',
        description: 'Deployment ID',
        type: String,
    })
    async getDeployment(
        @ObjectId('id') id: string,
    ): Promise<DeploymentResponseDto> {
        const deployments = await this.deploymentService.findOne({ _id: id });
        return new DeploymentResponseDto(deployments);
    }

    @Get(':deviceId/by-device')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'get deployment by device id',
        isArray: true,
        type: DeploymentResponseDto,
    })
    @ApiParam({
        name: 'deviceId',
        description: 'Device ID',
        type: String,
        example: 'building-a',
    })
    @ApiQuery({
        name: 'isLatest',
        description: 'Get the latest deployment',
        type: Boolean,
        example: true,
        required: false,
    })
    async getDeploymentsByDeviceId(
        @Param('deviceId') deviceId: string,
        @Query('isLatest') isLatest: boolean = false,
    ): Promise<DeploymentResponseDto[]> {
        const deployments = await this.deploymentService.find({
            deviceId: {
                $in: [deviceId],
            },
        });
        if (isLatest) return [new DeploymentResponseDto(deployments[0])];
        return deployments.map(
            (deployment) => new DeploymentResponseDto(deployment),
        );
    }

    @Post()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'create deployment successfully',
        type: DeploymentResponseDto,
    })
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createDeploymentDto: CreateDeploymentDto,
    ): Promise<DeploymentResponseDto> {
        const configurationId = createDeploymentDto.configurationId;
        const configuration = await this.configurationService.findOne({
            configurationId,
        });
        try {
            if (configuration.status === ConfigurationStatus.Undeployed)
                await this.configurationService.update(
                    { configurationId },
                    { status: ConfigurationStatus.Deployed },
                );
            const content =
                await this.configurationService.getConfigurationContent(
                    configuration.configurationId,
                );
            await Promise.all(
                createDeploymentDto.deviceId.map(async (deviceId) => {
                    await this.registryService.registry.applyConfigurationContentOnDevice(
                        deviceId,
                        content,
                    );
                    await this.deploymentService.update(
                        {
                            deviceId: {
                                $in: [deviceId],
                            },
                            isLatest: true,
                        },
                        {
                            isLatest: false,
                        },
                    );
                }),
            );
            const deployment = await this.deploymentService.create(
                createDeploymentDto.deviceId,
                DeploymentStatus.Success,
                configuration.id,
            );
            return new DeploymentResponseDto(deployment);
        } catch (error) {
            if (error instanceof Error) {
                await this.deploymentService.create(
                    createDeploymentDto.deviceId,
                    DeploymentStatus.Failure,
                    configuration.id,
                    false,
                    error.message,
                );
                throw new InternalServerErrorException(
                    `Failed to apply configuration with message: ${error.message}`,
                );
            }
        }
    }
}
