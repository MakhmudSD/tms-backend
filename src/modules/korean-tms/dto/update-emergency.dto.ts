import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEmergencyDto } from './create-emergency.dto';
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class UpdateEmergencyDto extends PartialType(CreateEmergencyDto) {
  @ApiProperty({ description: 'Current status of the emergency', example: 'responding', enum: ['reported', 'investigating', 'responding', 'resolved'], required: false })
  @IsEnum(['reported', 'investigating', 'responding', 'resolved'])
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Timestamp when response started', required: false })
  @IsOptional()
  response_started_at?: Date;

  @ApiProperty({ description: 'Timestamp when emergency was resolved', required: false })
  @IsOptional()
  resolved_at?: Date;

  @ApiProperty({ description: 'Time taken to resolve in minutes', example: 60, required: false })
  @IsNumber()
  @IsOptional()
  response_time_minutes?: number;

  @ApiProperty({ description: 'JSON array of response logs', type: 'array', items: { type: 'object' }, required: false })
  @IsOptional()
  response_logs?: Array<{ id: number; timestamp: string; action: string; details: string }>;
}
