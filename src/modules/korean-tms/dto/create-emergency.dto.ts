import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateEmergencyDto {
  @ApiProperty({ description: 'Type of emergency', example: 'accident', enum: ['accident', 'breakdown', 'theft', 'weather', 'traffic', 'other'] })
  @IsEnum(['accident', 'breakdown', 'theft', 'weather', 'traffic', 'other'])
  @IsNotEmpty()
  emergency_type: string;

  @ApiProperty({ description: 'Priority level', example: 'high', enum: ['low', 'medium', 'high', 'critical'], required: false })
  @IsEnum(['low', 'medium', 'high', 'critical'])
  @IsOptional()
  priority?: string;

  @ApiProperty({ description: 'Description of the emergency', example: 'Vehicle involved in a collision on highway.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Location of the emergency', example: 'Seoul, Gangnam-gu, Teheran-ro', required: false })
  @IsString()
  @IsOptional()
  current_location?: string;

  @ApiProperty({ description: 'Vehicle license plate involved', example: '서울 12가 3456', required: false })
  @IsString()
  @IsOptional()
  vehicle_plate?: string;

  @ApiProperty({ description: 'Driver name involved', example: '김운전', required: false })
  @IsString()
  @IsOptional()
  driver_name?: string;

  @ApiProperty({ description: 'Contact phone for emergency', example: '010-1234-5678', required: false })
  @IsString()
  @IsOptional()
  contact_phone?: string;

  @ApiProperty({ description: 'Asset ID (foreign key)', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  asset_id?: number;

  @ApiProperty({ description: 'Driver ID (foreign key)', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  driver_id?: number;
}
