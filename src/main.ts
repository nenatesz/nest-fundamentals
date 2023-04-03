import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guard/api-key.guard';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponsesInterceptor } from './common/interceptors/wrap-responses.interceptor';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // using this pipe in the main file limits us from injecting in dependencies, since we are not in a module.
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true 
    }
  }));
  // this method can only be used if the guard class doesn't use dependency injection.
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new WrapResponsesInterceptor(), new TimeoutInterceptor( ))
  //app.useGlobalGuards(new ApiKeyGuard())

  const options = new DocumentBuilder().setTitle('Iluvcoffee').setDescription('Coffee Application').setVersion('1.0').build()
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
