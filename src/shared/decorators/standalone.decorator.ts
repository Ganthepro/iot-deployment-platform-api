import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_STANDALONE = 'isStandalone';
export const Standalone = (): CustomDecorator<string> =>
    SetMetadata(IS_STANDALONE, true);
