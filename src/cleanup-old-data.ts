import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Mahmud2001',
  database: process.env.DB_DATABASE || 'postgres',
  synchronize: false,
  logging: true,
});

async function cleanupOldData() {
  await AppDataSource.initialize();
  console.log('🧹 Starting cleanup of old public schema data');
  console.log('============================================\n');

  try {
    // Clean up old public schema tables
    const tablesToClean = ['orders', 'drivers'];
    
    for (const table of tablesToClean) {
      console.log(`🗑️  Cleaning up public.${table} table...`);
      
      // Delete all records from the table
      const result = await AppDataSource.query(`DELETE FROM public.${table}`);
      console.log(`✅ Deleted all records from public.${table}`);
    }

    console.log('\n🎉 Cleanup completed successfully!');
    console.log('=====================================');
    console.log('✅ Old public schema data has been removed');
    console.log('✅ Korean TMS data in tms schema is preserved');
    console.log('✅ Database is now clean and ready for production');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

// Run cleanup if this file is executed directly
if (require.main === module) {
  cleanupOldData()
    .then(() => {
      console.log('✅ Cleanup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Cleanup failed:', error);
      process.exit(1);
    });
}

export { cleanupOldData };
