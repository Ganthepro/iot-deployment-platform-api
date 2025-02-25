import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DeploymentStatus } from './enums/deployment-status.enum';
import { DeviceDocument, Device } from '../device/device.schema';
import * as autopopulate from 'mongoose-autopopulate';

export type DeploymentDocument = HydratedDocument<Deployment>;

@Schema({
    timestamps: true,
    versionKey: '__v',
})
export class Deployment {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Device.name,
        autopopulate: true,
    })
    device: DeviceDocument;

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
    schema.plugin(autopopulate as any);
    return schema;
};
