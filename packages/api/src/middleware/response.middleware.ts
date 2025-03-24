import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ResponseMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const oldJson = res.json;
    res.json = (body) => {
      this.logger.debug(`Response body: ${JSON.stringify(body)}`);
      return oldJson.call(res, body);
    };

    const oldSend = res.send;
    res.send = (body) => {
      this.logger.debug(`Response body: ${JSON.stringify(body)}`);
      return oldSend.call(res, body);
    };

    next();
  }
} 