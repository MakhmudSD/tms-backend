import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SeedService } from './database/seeds/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('TMS API')
    .setDescription('Transport Management System API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Run database seeds after app bootstrap
  try {
    const seedService = app.get(SeedService);
    await seedService.runSeeds();
  } catch (error) {
    console.error('❌ Error running seeds:', error);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 TMS Backend running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api`);
}

bootstrap();
