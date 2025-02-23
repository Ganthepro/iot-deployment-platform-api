import { Controller, Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Injectable()
@Controller('deployment')
@ApiTags('Deployment')
export class DeploymentController {
    constructor() {}
}
