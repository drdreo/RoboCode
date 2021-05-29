/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { SocketAdapter } from './app/socket-adapter';

const logLevels: LogLevel[] = process.env.NODE_ENV === 'dev' ? ['log', 'error', 'warn', 'debug', 'verbose'] : ['error', 'warn', 'log'];

const whitelist =  ['http://localhost:4200', 'https://admin.socket.io'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logLevels
  });
  Logger.log(`Enabling CORS for ${ whitelist.join(' & ') }`);
  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`Origin[${ origin }] Not allowed by CORS`));
      }
    },
    allowedHeaders: 'X-Requested-With,X-HTTP-Method-Override,Content-Type,OPTIONS,Accept,Observe,sentry-trace',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
    credentials: true
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;

  app.useWebSocketAdapter(new SocketAdapter(app, whitelist));


  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
