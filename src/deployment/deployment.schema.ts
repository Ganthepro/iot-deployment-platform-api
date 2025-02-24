import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DeploymentStatus } from './enums/deployment-status.enum';

export type DeploymentDocument = HydratedDocument<Deployment>;

@Schema({
    timestamps: true,
    versionKey: '__v',
})
export class Deployment {
    @Prop({
        required: true,
    })
    deviceId: string;

    @Prop({
        required: true,
        enum: DeploymentStatus,
    })
    status: DeploymentStatus;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const DeploymentSchema = SchemaFactory.createForClass(Deployment);

export const DeploymentSchemaFactory = () => {
    const schema = DeploymentSchema;
    return schema;
};
