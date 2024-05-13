import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { appendFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: process.env.CORS
      ? [process.env.ADMIN_PANEL_DOMAIN, process.env.PUBLIC_WEBSITE_DOMAIN]
      : function (origin, callback) {
          return callback(null, true);
        },
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setDescription('Boilerplate API documentation')
    .addBearerAuth(
      { in: 'header', type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Access-token',
    )
    .setTitle('Boilerplate API')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();

function logErrorToFile(error: Error): void {
  const logsFolder = 'logs';
  const now = new Date();
  const fileName = `${now.toISOString()}.log`;
  const filePath = join(logsFolder, fileName);
  const timestamp = now.toString();

  const logMessage = `[${timestamp}] \nTRACE_STACK: ${error?.stack} \nMESSAGE: ${error?.message}`;

  appendFileSync(filePath, logMessage);
}

process.on('uncaughtException', (error: Error) => {
  logErrorToFile(error);
  console.log('Uncaught Exception\nPROCESS EXIT HAPPENED, CHECK LOGS FOLDER');
  process.exit(0);
});
