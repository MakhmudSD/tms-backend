import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Signup DTO
 * Clean validation for user registration
 */
export class SignupDto {
  @ApiProperty({ 
    description: 'Username for login', 
    example: 'admin',
    minLength: 3,
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ 
    description: 'Password', 
    example: 'admin123',
    minLength: 6
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'Full name', 
    example: 'System Administrator',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ 
    description: 'Email address', 
    example: 'admin@tms.com',
    required: false
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ 
    description: 'Phone number', 
    example: '010-1234-5678',
    required: false
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
