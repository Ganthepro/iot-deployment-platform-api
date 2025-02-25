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
    async getDeployments() {
        return await this.deploymentService.getDeployments();
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
        return await this.deploymentService.getDeployment(id);
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
