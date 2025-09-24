import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../orders/order.entity';

/**
 * Driver Entity
 * Maps to the existing drivers table in the database
 */
@Entity({ name: 'drivers', schema: 'public' })
export class Driver {
  @ApiProperty({ description: 'Driver ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Driver name', example: 'John Smith' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Driver phone number', example: '+1234567890' })
  @Column()
  phone: string;

  @ApiProperty({ description: 'Vehicle information', example: 'Toyota Camry - ABC123' })
  @Column()
  vehicle: string;

  @ApiProperty({ description: 'Driver license number', example: 'DL123456789' })
  @Column({ name: 'license_number', nullable: true })
  licenseNumber: string;

  @ApiProperty({ description: 'Driver status', example: 'available', enum: ['available', 'busy', 'offline'] })
  @Column({ default: 'available' })
  status: string;

  @ApiProperty({ description: 'Driver email', example: 'driver@tms.com' })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({ description: 'Driver address', example: '123 Main St, City, State' })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ description: 'Driver active status', example: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => Order, order => order.driver)
  orders: Order[];
}
