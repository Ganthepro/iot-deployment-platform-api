import {
    Injectable,
    InternalServerErrorException,
    OnApplicationBootstrap,
} from '@nestjs/common';
import { ContainerRegistryClient } from '@azure/container-registry';
import { DefaultAzureCredential } from '@azure/identity';
import { ConfigService } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';
import { Module } from 'src/shared/enums/module.enum';

@Injectable()
export class ContainerService implements OnApplicationBootstrap {
    public client: ContainerRegistryClient;

    constructor(private readonly configService: ConfigService) {}

    async onApplicationBootstrap() {
        const acrUrl = this.configService.getOrThrow<string>(
            GLOBAL_CONFIG.ACR_URL,
        );
        this.client = new ContainerRegistryClient(
            acrUrl,
            new DefaultAzureCredential(),
        );
    }

    async getTags(repositoryName: Module): Promise<string[]> {
        try {
            const repository = this.client.getRepository(repositoryName);
            const tags: string[] = [];
            for await (const manifest of repository.listManifestProperties()) {
                if (manifest.tags.length > 0) tags.push(manifest.tags[0]);
            }
            return tags;
        } catch (error) {
            if (error instanceof Error)
                throw new InternalServerErrorException(error.message);
        }
    }
}
