import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorDto } from '../dtos/error.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response<ErrorDto>>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: (exception.getResponse() as { message: string }).message,
            path: request.url,
        });
    }
}
