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
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dtos/create-configuration.dto';
import { ConfigurationResponseDto } from './dtos/configuration-response.dto';
import { ConfigurationModuleResponseDto } from './dtos/configuration-module-response.dto';

@Controller('configuration')
@Injectable()
@ApiTags('Configuration')
export class ConfigurationController {
    constructor(private readonly configurationService: ConfigurationService) {}

    @Post()
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'create configuration successfully',
        type: ConfigurationResponseDto,
    })
    @HttpCode(HttpStatus.CREATED)
    async createConfiguration(
        @Body() createConfigurationDto: CreateConfigurationDto,
    ): Promise<ConfigurationResponseDto> {
        try {
            const content =
                await this.configurationService.getConfigurationContent(
                    createConfigurationDto.baseTemplatedeploymentId,
                );
            const modules = createConfigurationDto.modules;
            content.modulesContent.$edgeAgent['properties.desired'].modules =
                this.configurationService.modulesBuilder(modules);
            const configuration = await this.configurationService.create(
                content,
                createConfigurationDto.configurationId,
            );
            await this.configurationService.createModules(
                modules,
                configuration,
            );
            return new ConfigurationResponseDto(configuration);
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(
                    `Failed to apply configuration with message: ${error.message}`,
                );
        }
    }

    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'list all configurations',
        isArray: true,
        type: ConfigurationResponseDto,
    })
    async getConfigurations(): Promise<ConfigurationResponseDto[]> {
        const configurations = await this.configurationService.find();
        return configurations.map(
            (configuration) => new ConfigurationResponseDto(configuration),
        );
    }

    @Get(':configurationId')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'get configuration',
        type: ConfigurationResponseDto,
    })
    @ApiParam({
        name: 'configurationId',
        description: 'configuration id',
        example: 'configuration-1',
        required: true,
        type: String,
    })
    async getConfiguration(
        @Param('configurationId') configurationId: string,
    ): Promise<ConfigurationResponseDto> {
        const configuration = await this.configurationService.findOne({
            configurationId,
        });
        return new ConfigurationResponseDto(configuration);
    }

    @Get(':configurationId/modules')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'list all modules',
        isArray: true,
        type: ConfigurationModuleResponseDto,
    })
    @ApiParam({
        name: 'configurationId',
        required: true,
        example: 'configuration-1',
        description: 'configuration id',
    })
    async getModules(
        @Param('configurationId') configurationId: string,
    ): Promise<ConfigurationModuleResponseDto[]> {
        const configuration = await this.configurationService.findOne({
            configurationId,
        });
        const modules = await this.configurationService.getModules(
            configuration.id,
        );
        return modules.map(
            (module) => new ConfigurationModuleResponseDto(module),
        );
    }
}
