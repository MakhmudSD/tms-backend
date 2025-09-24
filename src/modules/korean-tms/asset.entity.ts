import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Asset Entity - Korean TMS Schema
 * Maps to the tms.assets table in the database (vehicles)
 */
@Entity({ name: 'assets', schema: 'tms' })
export class Asset {
  @ApiProperty({ description: 'Asset ID', example: 1 })
  @PrimaryGeneratedColumn({ name: 'asset_id' })
  asset_id: number;

  @ApiProperty({ description: 'Asset name', example: '현대 소나타' })
  @Column({ name: 'asset_name' })
  asset_name: string;

  @ApiProperty({ description: 'Asset type', example: '승용차' })
  @Column({ name: 'asset_type', nullable: true })
  asset_type: string;

  @ApiProperty({ description: 'License plate', example: '서울 12가 3456' })
  @Column({ name: 'license_plate', nullable: true })
  license_plate: string;

  @ApiProperty({ description: 'Status', example: 'ACTIVE' })
  @Column({ default: 'ACTIVE' })
  status: string;

  @ApiProperty({ description: 'Branch ID', example: 1 })
  @Column({ name: 'branch_id', nullable: true })
  branch_id: number;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
