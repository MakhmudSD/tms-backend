import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Driver } from '../drivers/driver.entity';

/**
 * Order Entity
 * Maps to the existing orders table in the database
 */
@Entity({ name: 'orders', schema: 'public' })
export class Order {
  @ApiProperty({ description: 'Order ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Customer name', example: 'Jane Doe' })
  @Column({ name: 'customer_name' })
  customerName: string;

  @ApiProperty({ description: 'Customer phone', example: '+1234567890' })
  @Column({ name: 'customer_phone' })
  customerPhone: string;

  @ApiProperty({ description: 'Pickup location', example: '123 Main St, City, State' })
  @Column({ name: 'pickup_location' })
  pickupLocation: string;

  @ApiProperty({ description: 'Dropoff location', example: '456 Oak Ave, City, State' })
  @Column({ name: 'dropoff_location' })
  dropoffLocation: string;

  @ApiProperty({ description: 'Order status', example: 'pending', enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'] })
  @Column({ default: 'pending' })
  status: string;

  @ApiProperty({ description: 'Order priority', example: 'normal', enum: ['low', 'normal', 'high', 'urgent'] })
  @Column({ default: 'normal' })
  priority: string;

  @ApiProperty({ description: 'Order description', example: 'Transport passenger to airport' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Estimated fare', example: 25.50 })
  @Column({ name: 'estimated_fare', type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedFare: number;

  @ApiProperty({ description: 'Actual fare', example: 28.00 })
  @Column({ name: 'actual_fare', type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualFare: number;

  @ApiProperty({ description: 'Scheduled pickup time' })
  @Column({ name: 'scheduled_pickup_time', type: 'timestamp', nullable: true })
  scheduledPickupTime: Date;

  @ApiProperty({ description: 'Actual pickup time' })
  @Column({ name: 'actual_pickup_time', type: 'timestamp', nullable: true })
  actualPickupTime: Date;

  @ApiProperty({ description: 'Actual dropoff time' })
  @Column({ name: 'actual_dropoff_time', type: 'timestamp', nullable: true })
  actualDropoffTime: Date;

  @ApiProperty({ description: 'Driver ID (foreign key)' })
  @Column({ name: 'driver_id', nullable: true })
  driverId: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Driver, driver => driver.orders, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;
}
