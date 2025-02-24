import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Injectable,
    Param,
    Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeploymentService } from './deployment.service';
import { ApplyConfigurationDto } from './dtos/apply-configuration.dto';

@Injectable()
@Controller('deployment')
@ApiTags('Deployment')
export class DeploymentController {
    constructor(private readonly deploymentService: DeploymentService) {}

    @Get(':deploymentId')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'get deployment',
    })
    @ApiParam({
        name: 'deploymentId',
        required: true,
        example: 'infrastructure',
        description: 'deployment id',
    })
    async getDeployment(@Param('deploymentId') deploymentId: string) {
        return await this.deploymentService.getDeployment(deploymentId);
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

    @Post()
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'apply configuration',
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async applyConfiguration(
        @Body() applyConfigurationDto: ApplyConfigurationDto,
    ) {
        const configuration = await this.deploymentService.getDeployment(
            applyConfigurationDto.baseTemplatedeploymentId,
        );
        return await this.deploymentService.applyConfiguration(
            applyConfigurationDto.deviceId,
            configuration,
            applyConfigurationDto.modules,
        );
    }
}
