import { DataSource } from 'typeorm';
import { Driver } from './modules/drivers/driver.entity';
import { Order } from './modules/orders/order.entity';
import { Branch } from './modules/korean-tms/branch.entity';
import { Client } from './modules/korean-tms/client.entity';
import { Asset } from './modules/korean-tms/asset.entity';
import { Waypoint } from './modules/korean-tms/waypoint.entity';
import { Settlement } from './modules/korean-tms/settlement.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Mahmud2001',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [Driver, Order, Branch, Client, Asset, Waypoint, Settlement],
  synchronize: false,
});

async function populateData() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    // Check if data already exists
    const existingBranches = await dataSource.getRepository(Branch).count();
    const existingDrivers = await dataSource.getRepository(Driver).count();
    const existingOrders = await dataSource.getRepository(Order).count();
    
    if (existingBranches > 0 || existingDrivers > 0 || existingOrders > 0) {
      console.log('⚠️  Data already exists in database. Skipping population.');
      return;
    }

    // Create Branches
    const branches = [
      {
        branch_name: '서울지점',
        address: '서울특별시 강남구 테헤란로 123',
        phone_number: '02-1234-5678',
        manager_name: '김지점장',
        status: 'ACTIVE'
      },
      {
        branch_name: '부산지점',
        address: '부산광역시 해운대구 센텀중앙로 456',
        phone_number: '051-2345-6789',
        manager_name: '이지점장',
        status: 'ACTIVE'
      },
      {
        branch_name: '대구지점',
        address: '대구광역시 수성구 동대구로 789',
        phone_number: '053-3456-7890',
        manager_name: '박지점장',
        status: 'ACTIVE'
      }
    ];

    const savedBranches = await dataSource.getRepository(Branch).save(branches);
    console.log('✅ Created branches:', savedBranches.length);

    // Create Clients
    const clients = [
      {
        client_name: '삼성전자',
        contact_person: '김담당',
        email: 'kim@samsung.com',
        phone_number: '010-1111-2222',
        address: '서울특별시 강남구 테헤란로 100',
        status: 'ACTIVE'
      },
      {
        client_name: 'LG전자',
        contact_person: '이담당',
        email: 'lee@lg.com',
        phone_number: '010-2222-3333',
        address: '서울특별시 영등포구 여의대로 200',
        status: 'ACTIVE'
      },
      {
        client_name: '현대자동차',
        contact_person: '박담당',
        email: 'park@hyundai.com',
        phone_number: '010-3333-4444',
        address: '서울특별시 서초구 서초대로 300',
        status: 'ACTIVE'
      }
    ];

    const savedClients = await dataSource.getRepository(Client).save(clients);
    console.log('✅ Created clients:', savedClients.length);

    // Create Assets
    const assets = [
      {
        asset_type: '트럭',
        license_plate: '서울 12가 3456',
        model: '현대 포터',
        capacity: 2.5,
        status: 'AVAILABLE',
        branch_id: savedBranches[0].branch_id
      },
      {
        asset_type: '트럭',
        license_plate: '부산 34나 5678',
        model: '기아 봉고',
        capacity: 3.0,
        status: 'ASSIGNED',
        branch_id: savedBranches[1].branch_id
      },
      {
        asset_type: '트럭',
        license_plate: '대구 56다 7890',
        model: '현대 마이티',
        capacity: 4.5,
        status: 'AVAILABLE',
        branch_id: savedBranches[2].branch_id
      },
      {
        asset_type: '트럭',
        license_plate: '서울 78라 9012',
        model: '기아 타이탄',
        capacity: 5.0,
        status: 'MAINTENANCE',
        branch_id: savedBranches[0].branch_id
      },
      {
        asset_type: '트럭',
        license_plate: '부산 90마 1234',
        model: '현대 메가트럭',
        capacity: 7.5,
        status: 'AVAILABLE',
        branch_id: savedBranches[1].branch_id
      }
    ];

    const savedAssets = await dataSource.getRepository(Asset).save(assets);
    console.log('✅ Created assets:', savedAssets.length);

    // Create Waypoints
    const waypoints = [
      {
        waypoint_name: '인천국제공항',
        address: '인천광역시 중구 공항로 272',
        latitude: 37.4692,
        longitude: 126.4506,
        type: 'airport'
      },
      {
        waypoint_name: '부산항',
        address: '부산광역시 영도구 태종로 471',
        latitude: 35.1047,
        longitude: 129.0323,
        type: 'port'
      },
      {
        waypoint_name: '서울역',
        address: '서울특별시 용산구 한강대로 405',
        latitude: 37.5551,
        longitude: 126.9707,
        type: 'station'
      },
      {
        waypoint_name: '강남역',
        address: '서울특별시 강남구 강남대로 396',
        latitude: 37.4979,
        longitude: 127.0276,
        type: 'station'
      }
    ];

    const savedWaypoints = await dataSource.getRepository(Waypoint).save(waypoints);
    console.log('✅ Created waypoints:', savedWaypoints.length);

    // Create Drivers
    const drivers = [
      {
        name: '김운전',
        phone: '010-1234-5678',
        vehicle: '현대 포터 - 서울 12가 3456',
        licenseNumber: 'DL123456789',
        status: 'available',
        email: 'kim.driver@tms.com',
        address: '서울특별시 강남구 테헤란로 100',
        isActive: true
      },
      {
        name: '이운전',
        phone: '010-2345-6789',
        vehicle: '기아 봉고 - 부산 34나 5678',
        licenseNumber: 'DL234567890',
        status: 'busy',
        email: 'lee.driver@tms.com',
        address: '부산광역시 해운대구 센텀중앙로 200',
        isActive: true
      },
      {
        name: '박운전',
        phone: '010-3456-7890',
        vehicle: '현대 마이티 - 대구 56다 7890',
        licenseNumber: 'DL345678901',
        status: 'available',
        email: 'park.driver@tms.com',
        address: '대구광역시 수성구 동대구로 300',
        isActive: true
      },
      {
        name: '최운전',
        phone: '010-4567-8901',
        vehicle: '기아 타이탄 - 서울 78라 9012',
        licenseNumber: 'DL456789012',
        status: 'offline',
        email: 'choi.driver@tms.com',
        address: '서울특별시 서초구 서초대로 400',
        isActive: true
      },
      {
        name: '정운전',
        phone: '010-5678-9012',
        vehicle: '현대 메가트럭 - 부산 90마 1234',
        licenseNumber: 'DL567890123',
        status: 'available',
        email: 'jung.driver@tms.com',
        address: '부산광역시 사하구 낙동남로 500',
        isActive: true
      }
    ];

    const savedDrivers = await dataSource.getRepository(Driver).save(drivers);
    console.log('✅ Created drivers:', savedDrivers.length);

    // Create Orders
    const orders = [
      {
        customerName: '삼성전자 김담당',
        customerPhone: '010-1111-2222',
        pickupLocation: '서울특별시 강남구 테헤란로 100',
        dropoffLocation: '인천국제공항',
        status: 'pending',
        priority: 'high',
        description: '삼성전자 부품 운송',
        estimatedFare: 45000,
        scheduledPickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        driverId: null
      },
      {
        customerName: 'LG전자 이담당',
        customerPhone: '010-2222-3333',
        pickupLocation: '서울특별시 영등포구 여의대로 200',
        dropoffLocation: '부산항',
        status: 'assigned',
        priority: 'normal',
        description: 'LG전자 제품 운송',
        estimatedFare: 85000,
        scheduledPickupTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour from now
        driverId: savedDrivers[1].id
      },
      {
        customerName: '현대자동차 박담당',
        customerPhone: '010-3333-4444',
        pickupLocation: '서울특별시 서초구 서초대로 300',
        dropoffLocation: '대구광역시 수성구 동대구로 300',
        status: 'in_progress',
        priority: 'urgent',
        description: '현대자동차 부품 긴급 운송',
        estimatedFare: 120000,
        scheduledPickupTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        actualPickupTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        driverId: savedDrivers[2].id
      },
      {
        customerName: '삼성전자 김담당',
        customerPhone: '010-1111-2222',
        pickupLocation: '인천국제공항',
        dropoffLocation: '서울특별시 강남구 테헤란로 100',
        status: 'completed',
        priority: 'normal',
        description: '삼성전자 수입 부품 운송',
        estimatedFare: 35000,
        actualFare: 32000,
        scheduledPickupTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        actualPickupTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        actualDropoffTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        driverId: savedDrivers[0].id
      },
      {
        customerName: 'LG전자 이담당',
        customerPhone: '010-2222-3333',
        pickupLocation: '부산항',
        dropoffLocation: '서울특별시 영등포구 여의대로 200',
        status: 'completed',
        priority: 'low',
        description: 'LG전자 수출 제품 운송',
        estimatedFare: 75000,
        actualFare: 78000,
        scheduledPickupTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        actualPickupTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        actualDropoffTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        driverId: savedDrivers[4].id
      }
    ];

    const savedOrders = await dataSource.getRepository(Order).save(orders);
    console.log('✅ Created orders:', savedOrders.length);

    // Create Settlements
    const settlements = [
      {
        order_id: savedOrders[3].id,
        driver_id: savedDrivers[0].id,
        total_amount: 32000,
        settlement_date: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'COMPLETED',
        payment_method: '계좌이체'
      },
      {
        order_id: savedOrders[4].id,
        driver_id: savedDrivers[4].id,
        total_amount: 78000,
        settlement_date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'COMPLETED',
        payment_method: '계좌이체'
      },
      {
        order_id: savedOrders[1].id,
        driver_id: savedDrivers[1].id,
        total_amount: 85000,
        settlement_date: new Date(),
        status: 'PENDING',
        payment_method: '계좌이체'
      },
      {
        order_id: savedOrders[2].id,
        driver_id: savedDrivers[2].id,
        total_amount: 120000,
        settlement_date: new Date(),
        status: 'PENDING',
        payment_method: '계좌이체'
      }
    ];

    const savedSettlements = await dataSource.getRepository(Settlement).save(settlements);
    console.log('✅ Created settlements:', savedSettlements.length);

    console.log('🎉 Database populated successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Branches: ${savedBranches.length}`);
    console.log(`   - Clients: ${savedClients.length}`);
    console.log(`   - Assets: ${savedAssets.length}`);
    console.log(`   - Waypoints: ${savedWaypoints.length}`);
    console.log(`   - Drivers: ${savedDrivers.length}`);
    console.log(`   - Orders: ${savedOrders.length}`);
    console.log(`   - Settlements: ${savedSettlements.length}`);

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await dataSource.destroy();
  }
}

populateData();
