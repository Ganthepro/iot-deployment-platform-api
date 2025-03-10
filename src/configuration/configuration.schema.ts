import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ConfigurationStatus } from './enums/configuration-status.enum';

export type ConfigurationDocument = HydratedDocument<Configuration>;

@Schema({
    timestamps: false,
    versionKey: false,
})
export class Configuration {
    @Prop({
        required: true,
        type: String,
        unique: true,
    })
    configurationId: string;

    @Prop({
        required: true,
        enum: ConfigurationStatus,
        default: ConfigurationStatus.Undeployed,
    })
    status: ConfigurationStatus;
}

export const ConfigurationSchema = SchemaFactory.createForClass(Configuration);

export const ConfigurationSchemaFactory = () => {
    const schema = ConfigurationSchema;
    return schema;
};
