import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Get port from config
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3002);
  
  await app.listen(port);
  console.log(`🎥 Videos Service running on port ${port}`);
}
bootstrap();