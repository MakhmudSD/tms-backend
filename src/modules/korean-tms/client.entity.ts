import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'clients', schema: 'tms' })
export class Client {
  @ApiProperty({ description: 'Client ID', example: 1 })
  @PrimaryGeneratedColumn({ name: 'client_id' })
  client_id: number;

  @ApiProperty({ description: 'Client name', example: '김고객' })
  @Column({ name: 'client_name' })
  client_name: string;

  @ApiProperty({ description: 'Phone number', example: '010-1111-2222' })
  @Column({ name: 'phone_number', nullable: true })
  phone_number: string;

  @ApiProperty({ description: 'Email', example: 'client1@email.com' })
  @Column({ nullable: true })
  email: string;

  @ApiProperty({ description: 'Address', example: '서울특별시 강남구' })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ description: 'Status', example: 'ACTIVE' })
  @Column({ default: 'ACTIVE' })
  status: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
