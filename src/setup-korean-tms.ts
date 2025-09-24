import { DataSource } from 'typeorm';
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

async function setupKoreanTMS() {
  try {
    await AppDataSource.initialize();
    console.log('🚀 Setting up Korean TMS Database');
    console.log('==================================\n');

    // Create TMS schema if it doesn't exist
    await AppDataSource.query('CREATE SCHEMA IF NOT EXISTS tms;');
    console.log('✅ TMS schema created/verified');

    // Drop existing tables to start fresh
    const tablesToDrop = [
      'tms.settlements', 'tms.settlementitems', 'tms.waypoints', 
      'tms.assets', 'tms.branches', 'tms.clients', 'tms.users', 'tms.roles'
    ];
    
    for (const table of tablesToDrop) {
      try {
        await AppDataSource.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
      } catch (error) {
        // Ignore errors if table doesn't exist
      }
    }
    console.log('✅ Existing tables cleaned up');

    // Create roles table
    await AppDataSource.query(`
      CREATE TABLE tms.roles (
        role_id SERIAL PRIMARY KEY,
        role_name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Roles table created');

    // Create branches table
    await AppDataSource.query(`
      CREATE TABLE tms.branches (
        branch_id SERIAL PRIMARY KEY,
        branch_name VARCHAR(100) NOT NULL,
        address TEXT,
        phone_number VARCHAR(20),
        manager_name VARCHAR(100),
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Branches table created');

    // Create users table
    await AppDataSource.query(`
      CREATE TABLE tms.users (
        user_id SERIAL PRIMARY KEY,
        login_id VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone_number VARCHAR(20),
        branch_id INTEGER REFERENCES tms.branches(branch_id),
        role_id INTEGER REFERENCES tms.roles(role_id),
        status_code VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Create clients table
    await AppDataSource.query(`
      CREATE TABLE tms.clients (
        client_id SERIAL PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Clients table created');

    // Create assets table (vehicles)
    await AppDataSource.query(`
      CREATE TABLE tms.assets (
        asset_id SERIAL PRIMARY KEY,
        asset_name VARCHAR(100) NOT NULL,
        asset_type VARCHAR(50),
        license_plate VARCHAR(20),
        status VARCHAR(20) DEFAULT 'ACTIVE',
        branch_id INTEGER REFERENCES tms.branches(branch_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Assets table created');

    // Create waypoints table
    await AppDataSource.query(`
      CREATE TABLE tms.waypoints (
        waypoint_id SERIAL PRIMARY KEY,
        waypoint_name VARCHAR(100) NOT NULL,
        address TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Waypoints table created');

    // Create settlements table
    await AppDataSource.query(`
      CREATE TABLE tms.settlements (
        settlement_id SERIAL PRIMARY KEY,
        settlement_date DATE,
        total_amount DECIMAL(12, 2),
        status VARCHAR(20) DEFAULT 'PENDING',
        client_id INTEGER REFERENCES tms.clients(client_id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Settlements table created');

    // Insert sample data
    console.log('\n🌱 Inserting sample data...');

    // Insert roles
    await AppDataSource.query(`
      INSERT INTO tms.roles (role_name, description) VALUES
      ('admin', '시스템 관리자'),
      ('manager', '운영 관리자'),
      ('dispatcher', '배차 담당자'),
      ('driver', '운전자'),
      ('client', '고객');
    `);
    console.log('   ✅ Roles inserted');

    // Insert branches
    await AppDataSource.query(`
      INSERT INTO tms.branches (branch_name, address, phone_number, manager_name) VALUES
      ('서울지점', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '김지점장'),
      ('부산지점', '부산광역시 해운대구 센텀중앙로 456', '051-2345-6789', '이지점장'),
      ('대구지점', '대구광역시 수성구 동대구로 789', '053-3456-7890', '박지점장');
    `);
    console.log('   ✅ Branches inserted');

    // Insert users
    const hashedPassword = await bcrypt.hash('password123', 10);
    await AppDataSource.query(`
      INSERT INTO tms.users (login_id, password_hash, user_name, email, phone_number, branch_id, role_id) VALUES
      ('admin', '${hashedPassword}', '시스템 관리자', 'admin@tms.com', '010-1234-5678', 1, 1),
      ('manager', '${hashedPassword}', '운영 관리자', 'manager@tms.com', '010-2345-6789', 1, 2),
      ('dispatcher', '${hashedPassword}', '배차 담당자', 'dispatcher@tms.com', '010-3456-7890', 1, 3),
      ('driver1', '${hashedPassword}', '김운전', 'driver1@tms.com', '010-4567-8901', 1, 4),
      ('driver2', '${hashedPassword}', '이운전', 'driver2@tms.com', '010-5678-9012', 2, 4),
      ('driver3', '${hashedPassword}', '박운전', 'driver3@tms.com', '010-6789-0123', 3, 4);
    `);
    console.log('   ✅ Users inserted');

    // Insert clients
    await AppDataSource.query(`
      INSERT INTO tms.clients (client_name, phone_number, email, address) VALUES
      ('김고객', '010-1111-2222', 'client1@email.com', '서울특별시 강남구'),
      ('이고객', '010-3333-4444', 'client2@email.com', '부산광역시 해운대구'),
      ('박고객', '010-5555-6666', 'client3@email.com', '대구광역시 수성구'),
      ('최고객', '010-7777-8888', 'client4@email.com', '서울특별시 서초구'),
      ('정고객', '010-9999-0000', 'client5@email.com', '서울특별시 마포구');
    `);
    console.log('   ✅ Clients inserted');

    // Insert assets (vehicles)
    await AppDataSource.query(`
      INSERT INTO tms.assets (asset_name, asset_type, license_plate, branch_id) VALUES
      ('현대 소나타', '승용차', '서울 12가 3456', 1),
      ('기아 카니발', '승합차', '부산 34나 7890', 2),
      ('현대 그랜저', '승용차', '대구 56다 1234', 3),
      ('기아 스포티지', 'SUV', '서울 78라 5678', 1),
      ('현대 아반떼', '승용차', '서울 90마 9012', 1);
    `);
    console.log('   ✅ Assets (vehicles) inserted');

    // Insert waypoints
    await AppDataSource.query(`
      INSERT INTO tms.waypoints (waypoint_name, address, latitude, longitude, type) VALUES
      ('인천국제공항', '인천광역시 중구 공항로 272', 37.4602, 126.4407, 'AIRPORT'),
      ('김포공항', '서울특별시 강서구 하늘길 112', 37.5583, 126.7906, 'AIRPORT'),
      ('서울역', '서울특별시 중구 한강대로 405', 37.5551, 126.9705, 'STATION'),
      ('부산역', '부산광역시 동구 중앙대로 206', 35.1167, 129.0403, 'STATION'),
      ('강남역', '서울특별시 강남구 강남대로 396', 37.4979, 127.0276, 'STATION'),
      ('홍대입구역', '서울특별시 마포구 양화로 188', 37.5563, 126.9236, 'STATION');
    `);
    console.log('   ✅ Waypoints inserted');

    // Insert settlements
    await AppDataSource.query(`
      INSERT INTO tms.settlements (settlement_date, total_amount, status, client_id) VALUES
      (CURRENT_DATE, 50000, 'COMPLETED', 1),
      (CURRENT_DATE, 75000, 'COMPLETED', 2),
      (CURRENT_DATE, 30000, 'PENDING', 3),
      (CURRENT_DATE, 60000, 'COMPLETED', 4),
      (CURRENT_DATE, 45000, 'PENDING', 5);
    `);
    console.log('   ✅ Settlements inserted');

    // Get final counts
    const tables = ['roles', 'branches', 'users', 'clients', 'assets', 'waypoints', 'settlements'];
    console.log('\n📊 Final Data Counts:');
    
    for (const table of tables) {
      const result = await AppDataSource.query(`SELECT COUNT(*) as count FROM tms.${table}`);
      console.log(`   📁 tms.${table}: ${result[0].count} records`);
    }

    console.log('\n🎉 Korean TMS Setup Completed Successfully!');
    console.log('\n🔐 Login Credentials:');
    console.log('   Username: admin, Password: password123 (시스템 관리자)');
    console.log('   Username: manager, Password: password123 (운영 관리자)');
    console.log('   Username: dispatcher, Password: password123 (배차 담당자)');
    console.log('   Username: driver1, Password: password123 (김운전)');
    console.log('   Username: driver2, Password: password123 (이운전)');
    console.log('   Username: driver3, Password: password123 (박운전)');

    console.log('\n🏢 Branches:');
    console.log('   - 서울지점 (서울특별시 강남구)');
    console.log('   - 부산지점 (부산광역시 해운대구)');
    console.log('   - 대구지점 (대구광역시 수성구)');

  } catch (error) {
    console.error('❌ Error setting up Korean TMS:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('\n🔌 Database connection closed');
    }
  }
}

setupKoreanTMS();
