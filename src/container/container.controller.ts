import { Injectable, Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContainerService } from './container.service';

@Controller('container')
@Injectable()
@ApiTags('Container')
export class ContainerController {
    constructor(private readonly containerService: ContainerService) {}

    @Get('tags')
    @ApiQuery({
        name: 'repositoryName',
        required: true,
        type: String,
        description: 'Repository name',
        example: 'tamtikorn/api',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get tags',
        type: String,
        isArray: true,
    })
    async getTags(@Query('repositoryName') repositoryName: string) {
        return await this.containerService.getTags(repositoryName);
    }
}
