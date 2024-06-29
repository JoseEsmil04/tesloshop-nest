import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap')

  app.setGlobalPrefix('api'); // Prefijo url

  app.useGlobalPipes(
    new ValidationPipe({ // Validacion para evitar campos innecesarios
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  app.getHttpAdapter().getInstance().disable('x-powered-by') // disable x-powered-by

  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul Api')
    .setDescription('Teslo Shop Api Rest')
    .setVersion('1.0')
    .addTag('teslo')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  logger.log(`Server running on PORT: ${process.env.PORT}`);
  await app.listen(process.env.PORT);
}
bootstrap();
