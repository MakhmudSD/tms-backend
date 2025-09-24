import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Waypoint Entity - Korean TMS Schema
 * Maps to the tms.waypoints table in the database
 */
@Entity({ name: 'waypoints', schema: 'tms' })
export class Waypoint {
  @ApiProperty({ description: 'Waypoint ID', example: 1 })
  @PrimaryGeneratedColumn({ name: 'waypoint_id' })
  waypoint_id: number;

  @ApiProperty({ description: 'Waypoint name', example: '인천국제공항' })
  @Column({ name: 'waypoint_name' })
  waypoint_name: string;

  @ApiProperty({ description: 'Address', example: '인천광역시 중구 공항로 272' })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ description: 'Latitude', example: 37.4602 })
  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude: number;

  @ApiProperty({ description: 'Longitude', example: 126.4407 })
  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @ApiProperty({ description: 'Type', example: 'AIRPORT' })
  @Column({ nullable: true })
  type: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
