import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Asset } from './asset.entity';
import { Driver } from '../drivers/driver.entity';

@Entity({ name: 'emergencies', schema: 'tms' })
export class Emergency {
  @ApiProperty({ description: 'Emergency ID', example: 1 })
  @PrimaryGeneratedColumn({ name: 'emergency_id' })
  emergency_id: number;

  @ApiProperty({ description: 'Type of emergency', example: 'accident', enum: ['accident', 'breakdown', 'theft', 'weather', 'traffic', 'other'] })
  @Column({ name: 'emergency_type' })
  emergency_type: string;

  @ApiProperty({ description: 'Priority level', example: 'high', enum: ['low', 'medium', 'high', 'critical'] })
  @Column({ default: 'medium' })
  priority: string;

  @ApiProperty({ description: 'Current status of the emergency', example: 'reported', enum: ['reported', 'investigating', 'responding', 'resolved'] })
  @Column({ default: 'reported' })
  status: string;

  @ApiProperty({ description: 'Description of the emergency', example: 'Vehicle involved in a collision on highway.' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Location of the emergency', example: 'Seoul, Gangnam-gu, Teheran-ro' })
  @Column({ name: 'current_location', nullable: true })
  current_location: string;

  @ApiProperty({ description: 'Vehicle license plate involved', example: '서울 12가 3456' })
  @Column({ name: 'vehicle_plate', nullable: true })
  vehicle_plate: string;

  @ApiProperty({ description: 'Driver name involved', example: '김운전' })
  @Column({ name: 'driver_name', nullable: true })
  driver_name: string;

  @ApiProperty({ description: 'Contact phone for emergency', example: '010-1234-5678' })
  @Column({ name: 'contact_phone', nullable: true })
  contact_phone: string;

  @ApiProperty({ description: 'Timestamp when emergency was reported' })
  @CreateDateColumn({ name: 'reported_at' })
  reported_at: Date;

  @ApiProperty({ description: 'Timestamp when response started' })
  @Column({ name: 'response_started_at', type: 'timestamp', nullable: true })
  response_started_at: Date;

  @ApiProperty({ description: 'Timestamp when emergency was resolved' })
  @Column({ name: 'resolved_at', type: 'timestamp', nullable: true })
  resolved_at: Date;

  @ApiProperty({ description: 'Time taken to resolve in minutes', example: 60 })
  @Column({ name: 'response_time_minutes', type: 'int', nullable: true })
  response_time_minutes: number;

  @ApiProperty({ description: 'JSON array of response logs', type: 'array', items: { type: 'object' } })
  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  response_logs: Array<{ id: number; timestamp: string; action: string; details: string }>;

  @ApiProperty({ description: 'Foreign key to Asset entity', example: 1 })
  @Column({ name: 'asset_id', nullable: true })
  asset_id: number;

  @ApiProperty({ description: 'Foreign key to Driver entity', example: 1 })
  @Column({ name: 'driver_id', nullable: true })
  driver_id: number;

  @ManyToOne(() => Asset, { nullable: true })
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @ManyToOne(() => Driver, driver => driver.id, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
