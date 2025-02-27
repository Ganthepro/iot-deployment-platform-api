import { DeploymentDocument } from '../deployment.schema';

export class DeploymentResponseDto {
    deployment: DeploymentDocument;
    modules: {
        moduleId: string;
        tag: string;
    }[];

    constructor(
        deployment: DeploymentDocument,
        modules: { moduleId: string; tag: string }[],
    ) {
        this.deployment = deployment;
        this.modules = modules;
    }
}
