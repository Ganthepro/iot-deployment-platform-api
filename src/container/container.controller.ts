import { Injectable, Controller, Get, Query, HttpStatus } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContainerService } from './container.service';
import { Module } from 'src/shared/enums/module.enum';

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
        enum: [Module.API, Module.DataLoggerAgent, Module.IQASensorAgent],
        description: 'Repository name',
        example: Module.API,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get tags',
        type: String,
        isArray: true,
    })
    async getTags(@Query('repositoryName') repositoryName: Module) {
        return await this.containerService.getTags(repositoryName);
    }
}
