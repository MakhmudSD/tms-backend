import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './modules/auth/auth.service';

async function debugAuth() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const authService = app.get(AuthService);
    
    console.log('🔧 Testing auth service...');
    
    const result = await authService.validateUser('manager', 'password123');
    console.log('✅ Auth validation result:', result ? 'SUCCESS' : 'FAILED');
    
    if (result) {
      console.log('👤 User data:', {
        user_id: result.user_id,
        login_id: result.login_id,
        user_name: result.user_name,
        role_id: result.role_id
      });
    }
    
    await app.close();
  } catch (error) {
    console.error('❌ Auth debug failed:', error);
  }
}

debugAuth();
