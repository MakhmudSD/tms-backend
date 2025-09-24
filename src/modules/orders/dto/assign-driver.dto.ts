import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignDriverDto {
  @ApiProperty({ description: 'Driver ID to assign', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  driverId: number;
}
