import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
    @ApiProperty({
        description: 'HTTP status code',
        example: HttpStatus.BAD_REQUEST,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Error message',
        example: 'Bad Request',
    })
    message: string;

    @ApiProperty({
        description: 'Error path',
        example: '/user',
    })
    path: string;

    @ApiProperty({
        description: 'Timestamp',
        example: new Date().toISOString(),
    })
    timestamp: string;
}
