import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Module as ModuleEnum } from '../shared/enums/module.enum';

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
        default: true,
    })
    autoUpdate: boolean;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

export const ModuleSchemaFactory = () => {
    const schema = ModuleSchema;
    return schema;
};
