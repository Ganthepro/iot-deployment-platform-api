import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
    Deployment,
    DeploymentDocument,
} from '../deployment/deployment.schema';
import * as autopopulate from 'mongoose-autopopulate';
import { Module as ModuleEnum } from '../shared/enums/module.enum';

export type ModuleDeploymentDocument = HydratedDocument<ModuleDeployment>;

@Schema({
    timestamps: false,
    versionKey: false,
})
export class ModuleDeployment {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Deployment.name,
        autopopulate: true,
    })
    deployment: DeploymentDocument;

    @Prop({
        required: true,
        type: String,
        enum: ModuleEnum,
    })
    moduleId: ModuleEnum;

    @Prop()
    tag?: string;
}

export const ModuleDeploymentSchema =
    SchemaFactory.createForClass(ModuleDeployment);

export const ModuleDeploymentSchemaFactory = () => {
    const schema = ModuleDeploymentSchema;
    schema.plugin(autopopulate as any);
    return schema;
};
