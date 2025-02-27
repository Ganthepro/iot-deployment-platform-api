import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsUniqueModuleId(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsUniqueModuleId',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(value: any[]) {
                    if (!Array.isArray(value)) {
                        return false;
                    }
                    const moduleIds = value.map((module) => module.moduleId);
                    return new Set(moduleIds).size === moduleIds.length;
                },
                defaultMessage() {
                    return `moduleId must be unique within the modules array`;
                },
            },
        });
    };
}
