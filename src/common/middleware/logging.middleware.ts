import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.time('Request-Response Time')

    res.on('finish', () => console.timeEnd('Request-Response Time'));
    next();
  }
}
