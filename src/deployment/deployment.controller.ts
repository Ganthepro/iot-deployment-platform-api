import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Injectable,
    Param,
    Patch,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeploymentService } from './deployment.service';
import { ApplyConfigurationDto } from './dtos/apply-configuration.dto';
import { ObjectId } from 'src/shared/decorators/object-id.decorator';
import { DeploymentResponseDto } from './dtos/deployment-response.dto';

@Injectable()
@Controller('deployment')
@ApiTags('Deployment')
export class DeploymentController {
    constructor(private readonly deploymentService: DeploymentService) {}

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'list all deployments',
        isArray: true,
    })
    async getDeployments(): Promise<DeploymentResponseDto[]> {
        const deployments = await this.deploymentService.findDeployments();
        return await Promise.all(
            deployments.map(async (deployment) => {
                const deploymentModules =
                    await this.deploymentService.getDeployment(deployment.id);
                const modules = await Promise.all(
                    deploymentModules.map((deploymentModule) => {
                        return {
                            moduleId: deploymentModule.moduleId,
                            tag: deploymentModule.tag,
                        };
                    }),
                );
                return new DeploymentResponseDto(deployment, modules);
            }),
        );
    }

    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'get deployment',
    })
    @ApiParam({
        name: 'id',
        description: 'Deployment ID',
        type: String,
    })
    async getDeployment(@ObjectId('id') id: string) {
        const deployments = await this.deploymentService.findOne({ _id: id });
        const deploymentModules = await this.deploymentService.getDeployment(
            deployments.id,
        );
        const modules = await Promise.all(
            deploymentModules.map((deploymentModule) => {
                return {
                    moduleId: deploymentModule.moduleId,
                    tag: deploymentModule.tag,
                };
            }),
        );
        return new DeploymentResponseDto(deployments, modules);
    }

    @Get(':deviceId/modules')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'list all modules',
        isArray: true,
    })
    @ApiParam({
        name: 'deviceId',
        required: true,
        example: 'building-a',
        description: 'device id',
    })
    async getModules(@Param('deviceId') deviceId: string) {
        return await this.deploymentService.getModules(deviceId);
    }

    @Patch()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'apply configuration',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async applyConfiguration(
        @Body() applyConfigurationDto: ApplyConfigurationDto,
    ) {
        const configuration = await this.deploymentService.getConfiguration(
            applyConfigurationDto.baseTemplatedeploymentId,
        );
        return await this.deploymentService.applyConfiguration(
            applyConfigurationDto.deviceId,
            configuration,
            applyConfigurationDto.modules,
        );
    }
}
