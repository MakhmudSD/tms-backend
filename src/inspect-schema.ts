import { DataSource } from 'typeorm';
import { User } from './modules/users/user.entity';
import { Role } from './modules/users/role.entity';
import { Driver } from './modules/drivers/driver.entity';
import { Order } from './modules/orders/order.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Mahmud2001',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [User, Role, Driver, Order],
  synchronize: false,
  logging: false,
});

async function inspectSchema() {
  try {
    await AppDataSource.initialize();
    console.log('🔍 Database Schema Inspection Report');
    console.log('=====================================\n');

    // List all tables
    console.log('📋 All Tables:');
    const tables = await AppDataSource.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY table_schema, table_name;
    `);
    
    tables.forEach(table => {
      console.log(`  📁 ${table.table_schema}.${table.table_name}`);
    });

    console.log('\n📊 Table Details:');
    
    // Inspect each table
    for (const table of tables) {
      console.log(`\n🔍 ${table.table_schema}.${table.table_name}:`);
      
      const columns = await AppDataSource.query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable, 
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_schema = '${table.table_schema}' 
        AND table_name = '${table.table_name}'
        ORDER BY ordinal_position;
      `);
      
      columns.forEach(col => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const maxLength = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
        const defaultValue = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        
        console.log(`  📝 ${col.column_name}: ${col.data_type}${maxLength} ${nullable}${defaultValue}`);
      });

      // Check foreign keys
      const foreignKeys = await AppDataSource.query(`
        SELECT 
          kcu.column_name,
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = '${table.table_schema}'
        AND tc.table_name = '${table.table_name}';
      `);

      if (foreignKeys.length > 0) {
        console.log('  🔗 Foreign Keys:');
        foreignKeys.forEach(fk => {
          console.log(`    ${fk.column_name} → ${fk.foreign_table_schema}.${fk.foreign_table_name}.${fk.foreign_column_name}`);
        });
      }

      // Count records
      const count = await AppDataSource.query(`SELECT COUNT(*) as count FROM ${table.table_schema}.${table.table_name};`);
      console.log(`  📈 Records: ${count[0].count}`);
    }

    console.log('\n✅ Schema inspection completed successfully!');

  } catch (error) {
    console.error('❌ Error inspecting schema:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

inspectSchema();
