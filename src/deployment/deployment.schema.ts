import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DeploymentStatus } from './enums/deployment-status.enum';
import * as autopopulate from 'mongoose-autopopulate';
import {
    Configuration,
    ConfigurationDocument,
} from 'src/configuration/configuration.schema';

export type DeploymentDocument = HydratedDocument<Deployment>;

@Schema({
    timestamps: true,
    versionKey: '__v',
})
export class Deployment {
    @Prop({
        required: true,
        type: [String],
    })
    deviceId: string[];

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Configuration.name,
        autopopulate: true,
    })
    configuration: ConfigurationDocument;

    @Prop({
        required: true,
        enum: DeploymentStatus,
    })
    status: DeploymentStatus;

    @Prop({
        required: true,
        type: String,
        default: null,
    })
    message?: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);

export const DeploymentSchemaFactory = () => {
    const schema = DeploymentSchema;
    schema.plugin(autopopulate as any);
    return schema;
};
