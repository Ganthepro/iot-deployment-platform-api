import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({
    timestamps: false,
    versionKey: false,
})
export class Device {
    @Prop({
        required: true,
        unique: true,
    })
    deviceId: string;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

export const DeviceSchemaFactory = () => {
    const schema = DeviceSchema;
    return schema;
};
