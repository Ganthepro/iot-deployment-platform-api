import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ContainerRegistryClient } from '@azure/container-registry';
import { DefaultAzureCredential } from '@azure/identity';
import { ConfigService } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';
import { ModuleService } from 'src/module/module.service';

@Injectable()
export class ContainerService implements OnApplicationBootstrap {
    public client: ContainerRegistryClient;

    constructor(
        private readonly configService: ConfigService,
        private readonly moduleService: ModuleService,
    ) {}

    async onApplicationBootstrap() {
        const acrUrl = this.configService.getOrThrow<string>(
            GLOBAL_CONFIG.ACR_URL,
        );
        this.client = new ContainerRegistryClient(
            acrUrl,
            new DefaultAzureCredential(),
        );
        const repositories = this.client.listRepositoryNames();
        for await (const repository of repositories) {
            const moduleId = repository.split('/')[1];
            const tags = await this.getTags(repository);
            await this.moduleService.updateTags(moduleId, tags);
        }
    }

    async getTags(repositoryName: string): Promise<string[]> {
        const repository = this.client.getRepository(repositoryName);
        const tags: string[] = [];
        for await (const manifest of repository.listManifestProperties()) {
            if (manifest.tags.length > 0) tags.push(manifest.tags[0]);
        }
        // console.log(tags);
        return tags;
    }
}
