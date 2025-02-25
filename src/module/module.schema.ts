import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Module as ModuleEnum } from '../shared/enums/module.enum';
import { Device, DeviceDocument } from 'src/device/device.schema';
import * as autopopulate from 'mongoose-autopopulate';

export type ModuleDocument = HydratedDocument<Module>;

@Schema({
    timestamps: false,
    versionKey: false,
})
export class Module {
    @Prop({
        required: true,
        enum: ModuleEnum,
        unique: true,
    })
    moduleId: ModuleEnum;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Device.name,
    })
    device: DeviceDocument;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

export const ModuleSchemaFactory = () => {
    const schema = ModuleSchema;
    schema.plugin(autopopulate as any);
    return schema;
};
