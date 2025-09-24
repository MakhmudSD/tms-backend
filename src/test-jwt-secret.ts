import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtService } from '@nestjs/jwt';

async function testJWTSecret() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const jwtService = app.get(JwtService);
    
    console.log('🔧 Testing JWT secret...');
    
    const payload = { username: 'test', sub: 1 };
    const token = jwtService.sign(payload);
    console.log('✅ JWT token generated:', token);
    
    const decoded = jwtService.verify(token);
    console.log('✅ JWT token verified:', decoded);
    
    await app.close();
  } catch (error) {
    console.error('❌ JWT test failed:', error);
  }
}

testJWTSecret();