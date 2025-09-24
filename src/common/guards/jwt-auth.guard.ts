import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    console.log('🔧 JwtAuthGuard: Extracted token:', token ? 'Token found' : 'No token');
    console.log('🔧 JwtAuthGuard: Authorization header:', request.headers.authorization);
    
    if (!token) {
      console.log('❌ JwtAuthGuard: No token found in Authorization header');
      throw new UnauthorizedException('Access token is required');
    }
    
    try {
      console.log('🔧 JwtAuthGuard: Verifying token...');
      const payload = await this.jwtService.verifyAsync(token);
      console.log('✅ JwtAuthGuard: Token verified successfully');
      console.log('🔧 JwtAuthGuard: Token payload:', payload);
      
      request['user'] = payload;
      return true;
    } catch (error) {
      console.log('❌ JwtAuthGuard: Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    console.log('🔧 JwtAuthGuard: Raw authorization header:', authHeader);
    
    if (!authHeader) {
      return undefined;
    }
    
    const [type, token] = authHeader.split(' ');
    console.log('🔧 JwtAuthGuard: Token type:', type, 'Token:', token ? 'Present' : 'Missing');
    
    return type === 'Bearer' ? token : undefined;
  }
}
