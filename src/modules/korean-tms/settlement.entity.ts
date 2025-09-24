import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'settlements', schema: 'tms' })
export class Settlement {
  @ApiProperty({ description: 'Settlement ID', example: 1 })
  @PrimaryGeneratedColumn({ name: 'settlement_id' })
  settlement_id: number;

  @ApiProperty({ description: 'Settlement date' })
  @Column({ name: 'settlement_date', type: 'date', nullable: true })
  settlement_date: Date;

  @ApiProperty({ description: 'Total amount', example: 50000 })
  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  total_amount: number;

  @ApiProperty({ description: 'Status', example: 'COMPLETED' })
  @Column({ default: 'PENDING' })
  status: string;

  @ApiProperty({ description: 'Client ID', example: 1 })
  @Column({ name: 'client_id', nullable: true })
  client_id: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
