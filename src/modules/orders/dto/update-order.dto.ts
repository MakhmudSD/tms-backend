import { IsString, IsOptional, IsNumber, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({ description: 'Customer name', example: 'Jane Doe', required: false })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({ description: 'Customer phone', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ description: 'Pickup location', example: '123 Main St, City, State', required: false })
  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @ApiProperty({ description: 'Dropoff location', example: '456 Oak Ave, City, State', required: false })
  @IsOptional()
  @IsString()
  dropoffLocation?: string;

  @ApiProperty({ description: 'Order priority', example: 'normal', enum: ['low', 'normal', 'high', 'urgent'], required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ description: 'Order description', example: 'Transport passenger to airport', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Estimated fare', example: 25.5, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'estimatedFare must be a number' })
  @Min(0)
  estimatedFare?: number;

  @ApiProperty({ description: 'Scheduled pickup time', example: '2025-01-15T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  scheduledPickupTime?: string;
}
