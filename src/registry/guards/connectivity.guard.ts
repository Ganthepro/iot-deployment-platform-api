import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RegistryService } from '../registry.service';
import { IS_STANDALONE } from '../../shared/decorators/standalone.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ConnectivityGuard implements CanActivate {
    constructor(
        private readonly registryService: RegistryService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isStandalone = this.reflector.getAllAndOverride<boolean>(
            IS_STANDALONE,
            [context.getHandler(), context.getClass()],
        );
        if (isStandalone) return true;
        await this.registryService.checkConnectivity();
        return true;
    }
}
