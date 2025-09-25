import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { seedUsers } from './user.seed';

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async runSeeds(): Promise<void> {
    try {
      console.log('🌱 Running database seeds...');
      
      // Run all seed functions
      await seedUsers(this.dataSource);
      
      console.log('✅ Database seeds completed successfully');
    } catch (error) {
      console.error('❌ Error running seeds:', error);
      throw error;
    }
  }
}
