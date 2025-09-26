import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ 
    status: 201, 
    description: 'Account created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            user_id: { type: 'number' },
            login_id: { type: 'string' },
            user_name: { type: 'string' },
            email: { type: 'string' },
            role_id: { type: 'number' },
          },
        },
        isAdmin: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Username already exists' })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    try {
      const result = await this.authService.signup(signupDto);
      return result;
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            role: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }
}
