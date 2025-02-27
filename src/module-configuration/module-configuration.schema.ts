import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {
    Configuration,
    ConfigurationDocument,
} from '../configuration/configuration.schema';
import * as autopopulate from 'mongoose-autopopulate';
import { Module as ModuleEnum } from '../shared/enums/module.enum';

export type ModuleConfigurationDocument = HydratedDocument<ModuleConfiguration>;

@Schema({
    timestamps: false,
    versionKey: false,
})
export class ModuleConfiguration {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Configuration.name,
        autopopulate: true,
    })
    configuration: ConfigurationDocument;

    @Prop({
        required: true,
        type: String,
        enum: ModuleEnum,
    })
    moduleId: ModuleEnum;

    @Prop()
    tag?: string;
}

export const ModuleConfigurationSchema =
    SchemaFactory.createForClass(ModuleConfiguration);

export const ModuleConfigurationSchemaFactory = () => {
    const schema = ModuleConfigurationSchema;
    schema.plugin(autopopulate as any);
    return schema;
};
