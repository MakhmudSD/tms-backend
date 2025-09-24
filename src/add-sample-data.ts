import { DataSource } from 'typeorm';
import { Driver } from './modules/drivers/driver.entity';
import { Order } from './modules/orders/order.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Mahmud2001',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [Driver, Order],
  synchronize: false,
});

async function addSampleData() {
  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

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

    console.log('🎉 Sample data added successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Drivers: ${savedDrivers.length}`);
    console.log(`   - Orders: ${savedOrders.length}`);

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    await dataSource.destroy();
  }
}

addSampleData();
