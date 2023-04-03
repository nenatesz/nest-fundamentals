import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    // get the error response
    const response = context.getResponse<Response>();

    // get the status code and response from the exception
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    console.log('exceptionResponse', exceptionResponse)
    const error = typeof response === 'string' ?
      {message: exceptionResponse } : (exceptionResponse as object)

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString()
    })
  }
}
