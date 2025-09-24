import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Mahmud2001',
  database: process.env.DB_DATABASE || 'postgres',
  synchronize: false,
  logging: true,
});

async function importKoreanTMS() {
  try {
    await AppDataSource.initialize();
    console.log('🚀 Starting Korean TMS DDL Import');
    console.log('==================================\n');

    // Read the DDL file
    const ddlPath = '/Users/makhmudjonkudratov/Downloads/개발자테스트_TMS/개발자 테스트_TMS DDL.txt';
    const ddlContent = fs.readFileSync(ddlPath, 'utf8');
    
    console.log('📄 DDL file loaded successfully');
    console.log(`📊 File size: ${(ddlContent.length / 1024).toFixed(2)} KB`);

    // Split DDL into individual statements
    const statements = ddlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .map(stmt => stmt + ';');

    console.log(`📝 Found ${statements.length} SQL statements`);

    // Execute DDL statements
    console.log('\n🔧 Executing DDL statements...');
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await AppDataSource.query(statement);
        successCount++;
        if (i % 10 === 0) {
          console.log(`   ✅ Processed ${i + 1}/${statements.length} statements`);
        }
      } catch (error) {
        errorCount++;
        console.log(`   ❌ Error in statement ${i + 1}: ${error.message}`);
        // Continue with other statements
      }
    }

    console.log(`\n📊 DDL Import Results:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);

    // Create sample data for main tables
    console.log('\n🌱 Creating sample data...');
    
    // Insert sample roles
    await AppDataSource.query(`
      INSERT INTO tms.roles (role_name, description) VALUES
      ('admin', '시스템 관리자'),
      ('manager', '운영 관리자'),
      ('dispatcher', '배차 담당자'),
      ('driver', '운전자'),
      ('client', '고객')
      ON CONFLICT (role_name) DO NOTHING;
    `);
    console.log('   ✅ Sample roles inserted');

    // Insert sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    await AppDataSource.query(`
      INSERT INTO tms.users (login_id, password_hash, user_name, email, phone_number, status_code, role_id) VALUES
      ('admin', '${hashedPassword}', '시스템 관리자', 'admin@tms.com', '010-1234-5678', 'ACTIVE', (SELECT role_id FROM tms.roles WHERE role_name = 'admin')),
      ('manager', '${hashedPassword}', '운영 관리자', 'manager@tms.com', '010-2345-6789', 'ACTIVE', (SELECT role_id FROM tms.roles WHERE role_name = 'manager')),
      ('dispatcher', '${hashedPassword}', '배차 담당자', 'dispatcher@tms.com', '010-3456-7890', 'ACTIVE', (SELECT role_id FROM tms.roles WHERE role_name = 'dispatcher')),
      ('driver1', '${hashedPassword}', '김운전', 'driver1@tms.com', '010-4567-8901', 'ACTIVE', (SELECT role_id FROM tms.roles WHERE role_name = 'driver')),
      ('driver2', '${hashedPassword}', '이운전', 'driver2@tms.com', '010-5678-9012', 'ACTIVE', (SELECT role_id FROM tms.roles WHERE role_name = 'driver'))
      ON CONFLICT (login_id) DO NOTHING;
    `);
    console.log('   ✅ Sample users inserted');

    // Insert sample branches
    await AppDataSource.query(`
      INSERT INTO tms.branches (branch_name, address, phone_number, manager_name) VALUES
      ('서울지점', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '김지점장'),
      ('부산지점', '부산광역시 해운대구 센텀중앙로 456', '051-2345-6789', '이지점장'),
      ('대구지점', '대구광역시 수성구 동대구로 789', '053-3456-7890', '박지점장')
      ON CONFLICT DO NOTHING;
    `);
    console.log('   ✅ Sample branches inserted');

    // Insert sample assets (vehicles)
    await AppDataSource.query(`
      INSERT INTO tms.assets (asset_name, asset_type, license_plate, status, branch_id) VALUES
      ('현대 소나타', '승용차', '서울 12가 3456', 'ACTIVE', (SELECT branch_id FROM tms.branches WHERE branch_name = '서울지점')),
      ('기아 카니발', '승합차', '부산 34나 7890', 'ACTIVE', (SELECT branch_id FROM tms.branches WHERE branch_name = '부산지점')),
      ('현대 그랜저', '승용차', '대구 56다 1234', 'ACTIVE', (SELECT branch_id FROM tms.branches WHERE branch_name = '대구지점')),
      ('기아 스포티지', 'SUV', '서울 78라 5678', 'ACTIVE', (SELECT branch_id FROM tms.branches WHERE branch_name = '서울지점'))
      ON CONFLICT DO NOTHING;
    `);
    console.log('   ✅ Sample assets (vehicles) inserted');

    // Insert sample clients
    await AppDataSource.query(`
      INSERT INTO tms.clients (client_name, phone_number, email, address, status) VALUES
      ('김고객', '010-1111-2222', 'client1@email.com', '서울특별시 강남구', 'ACTIVE'),
      ('이고객', '010-3333-4444', 'client2@email.com', '부산광역시 해운대구', 'ACTIVE'),
      ('박고객', '010-5555-6666', 'client3@email.com', '대구광역시 수성구', 'ACTIVE'),
      ('최고객', '010-7777-8888', 'client4@email.com', '서울특별시 서초구', 'ACTIVE')
      ON CONFLICT DO NOTHING;
    `);
    console.log('   ✅ Sample clients inserted');

    // Insert sample waypoints
    await AppDataSource.query(`
      INSERT INTO tms.waypoints (waypoint_name, address, latitude, longitude, type) VALUES
      ('인천국제공항', '인천광역시 중구 공항로 272', 37.4602, 126.4407, 'AIRPORT'),
      ('김포공항', '서울특별시 강서구 하늘길 112', 37.5583, 126.7906, 'AIRPORT'),
      ('서울역', '서울특별시 중구 한강대로 405', 37.5551, 126.9705, 'STATION'),
      ('부산역', '부산광역시 동구 중앙대로 206', 35.1167, 129.0403, 'STATION'),
      ('강남역', '서울특별시 강남구 강남대로 396', 37.4979, 127.0276, 'STATION')
      ON CONFLICT DO NOTHING;
    `);
    console.log('   ✅ Sample waypoints inserted');

    // Insert sample settlements
    await AppDataSource.query(`
      INSERT INTO tms.settlements (settlement_date, total_amount, status, client_id) VALUES
      (CURRENT_DATE, 50000, 'COMPLETED', (SELECT client_id FROM tms.clients WHERE client_name = '김고객')),
      (CURRENT_DATE, 75000, 'COMPLETED', (SELECT client_id FROM tms.clients WHERE client_name = '이고객')),
      (CURRENT_DATE, 30000, 'PENDING', (SELECT client_id FROM tms.clients WHERE client_name = '박고객')),
      (CURRENT_DATE, 60000, 'COMPLETED', (SELECT client_id FROM tms.clients WHERE client_name = '최고객'))
      ON CONFLICT DO NOTHING;
    `);
    console.log('   ✅ Sample settlements inserted');

    // Get final counts
    const tables = ['roles', 'users', 'branches', 'assets', 'clients', 'waypoints', 'settlements'];
    console.log('\n📊 Final Data Counts:');
    
    for (const table of tables) {
      try {
        const result = await AppDataSource.query(`SELECT COUNT(*) as count FROM tms.${table}`);
        console.log(`   📁 tms.${table}: ${result[0].count} records`);
      } catch (error) {
        console.log(`   ❌ tms.${table}: Error counting records`);
      }
    }

    console.log('\n🎉 Korean TMS Import Completed Successfully!');
    console.log('\n🔐 Login Credentials:');
    console.log('   Username: admin, Password: password123 (시스템 관리자)');
    console.log('   Username: manager, Password: password123 (운영 관리자)');
    console.log('   Username: dispatcher, Password: password123 (배차 담당자)');
    console.log('   Username: driver1, Password: password123 (김운전)');
    console.log('   Username: driver2, Password: password123 (이운전)');

  } catch (error) {
    console.error('❌ Error importing Korean TMS:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('\n🔌 Database connection closed');
    }
  }
}

importKoreanTMS();
