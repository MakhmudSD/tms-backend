import { IsString, IsEmail, IsOptional, IsIn, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverDto {
  @ApiProperty({ description: 'Driver name', example: 'John Smith', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Driver phone number', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Vehicle information', example: 'Toyota Camry - ABC123', required: false })
  @IsOptional()
  @IsString()
  vehicle?: string;

  @ApiProperty({ description: 'Driver license number', example: 'DL123456789', required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ description: 'Driver status', example: 'available', enum: ['available', 'busy', 'offline'], required: false })
  @IsOptional()
  @IsIn(['available', 'busy', 'offline'])
  status?: string;

  @ApiProperty({ description: 'Driver email', example: 'driver@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Driver address', example: '123 Main St, City, State', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Driver active status', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
