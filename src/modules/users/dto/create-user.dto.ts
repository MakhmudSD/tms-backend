import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Username', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'User role', example: 'dispatcher', enum: ['admin', 'manager', 'dispatcher'] })
  @IsString()
  @IsIn(['admin', 'manager', 'dispatcher'])
  role: string;

  @ApiProperty({ description: 'User email', example: 'john@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Full name', example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;
}
