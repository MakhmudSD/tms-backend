import { IsString, IsNotEmpty, IsOptional, IsIn, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'Customer name', example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ description: 'Customer phone', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ description: 'Pickup location', example: '123 Main St, City, State' })
  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @ApiProperty({ description: 'Dropoff location', example: '456 Oak Ave, City, State' })
  @IsString()
  @IsNotEmpty()
  dropoffLocation: string;

  @ApiProperty({ description: 'Order priority', example: 'normal', enum: ['low', 'normal', 'high', 'urgent'], required: false })
  @IsOptional()
  @IsIn(['low', 'normal', 'high', 'urgent'])
  priority?: string;

  @ApiProperty({ description: 'Order description', example: 'Transport passenger to airport', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Estimated fare', example: 25.50, required: false })
  @IsOptional()
  @IsNumber()
  estimatedFare?: number;

  @ApiProperty({ description: 'Scheduled pickup time', example: '2024-01-15T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  scheduledPickupTime?: string;
}
