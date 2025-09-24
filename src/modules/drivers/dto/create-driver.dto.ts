import { IsString, IsNotEmpty, IsEmail, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({ description: 'Driver name', example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Driver phone number', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Vehicle information', example: 'Toyota Camry - ABC123' })
  @IsString()
  @IsNotEmpty()
  vehicle: string;

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
}
