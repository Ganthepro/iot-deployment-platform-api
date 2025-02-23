import {
    Controller,
    Get,
    HttpStatus,
    Injectable,
    Param,
    Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeploymentService } from './deployment.service';

@Injectable()
@Controller('deployment')
@ApiTags('Deployment')
export class DeploymentController {
    constructor(private readonly deploymentService: DeploymentService) {}

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

    @Post(':deviceId')
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'apply configuration',
    })
    @ApiParam({
        name: 'deviceId',
        required: true,
        example: 'building-a',
        description: 'device id',
    })
    async applyConfiguration(@Param('deviceId') deviceId: string) {
        const configuration = {
            modulesContent: {
                $edgeAgent: {
                    'properties.desired': {
                        schemaVersion: '1.1',
                        runtime: {
                            type: 'docker',
                            settings: {
                                registryCredentials: {
                                    tamtikorn: {
                                        address: 'tamtikorn.azurecr.io',
                                        password:
                                            'AyqmDBcIiKoJEo/g+irxpJbL+e1B4Lf2lOVf729k6K+ACRC0pOei',
                                        username: 'tamtikorn',
                                    },
                                },
                            },
                        },
                        systemModules: {
                            edgeAgent: {
                                settings: {
                                    image: 'mcr.microsoft.com/azureiotedge-agent:1.5',
                                },
                                type: 'docker',
                            },
                            edgeHub: {
                                restartPolicy: 'always',
                                settings: {
                                    image: 'mcr.microsoft.com/azureiotedge-hub:1.5',
                                    createOptions:
                                        '{"HostConfig":{"PortBindings":{"443/tcp":[{"HostPort":"443"}],"5671/tcp":[{"HostPort":"5671"}],"8883/tcp":[{"HostPort":"8883"}]}}}',
                                },
                                status: 'running',
                                type: 'docker',
                            },
                        },
                        modules: {
                            postgres: {
                                env: {
                                    POSTGRES_USER: {
                                        value: 'postgres',
                                    },
                                    POSTGRES_PASSWORD: {
                                        value: 'ganza112',
                                    },
                                    POSTGRES_DB: {
                                        value: 'postgres',
                                    },
                                },
                                restartPolicy: 'always',
                                settings: {
                                    image: 'postgres:alpine3.20',
                                },
                                startupOrder: 200,
                                status: 'running',
                                type: 'docker',
                            },
                        },
                    },
                },
                $edgeHub: {
                    'properties.desired': {
                        schemaVersion: '1.1',
                        storeAndForwardConfiguration: {
                            timeToLiveSecs: 7200,
                        },
                        routes: {},
                    },
                },
            },
        };
        return await this.deploymentService.applyConfiguration(
            deviceId,
            configuration,
        );
    }
}
