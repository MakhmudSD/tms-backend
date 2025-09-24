import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './modules/users/user.entity';
import { Driver } from './modules/drivers/driver.entity';
import { Order } from './modules/orders/order.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: 'postgres',
  entities: [User, Driver, Order],
  synchronize: false,
  schema: 'tms',
});

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    const userRepository = AppDataSource.getRepository(User);
    const driverRepository = AppDataSource.getRepository(Driver);
    const orderRepository = AppDataSource.getRepository(Order);

    // Clear existing data
    await orderRepository.delete({});
    await driverRepository.delete({});
    await userRepository.delete({});

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        login_id: 'admin',
        password_hash: hashedPassword,
        user_name: 'System Administrator',
        email: 'admin@tms.com',
        status_code: 'ACTIVE',
        role_id: 1, // Assuming admin role has ID 1
      },
      {
        login_id: 'manager',
        password_hash: hashedPassword,
        user_name: 'John Manager',
        email: 'manager@tms.com',
        status_code: 'ACTIVE',
        role_id: 2, // Assuming manager role has ID 2
      },
      {
        login_id: 'dispatcher',
        password_hash: hashedPassword,
        user_name: 'Jane Dispatcher',
        email: 'dispatcher@tms.com',
        status_code: 'ACTIVE',
        role_id: 3, // Assuming dispatcher role has ID 3
      },
    ];

    const createdUsers = await userRepository.save(users);
    console.log('Users created:', createdUsers.length);

    // Create drivers
    const drivers = [
      {
        name: 'Mike Johnson',
        phone: '+1234567890',
        vehicle: 'Toyota Camry - ABC123',
        licenseNumber: 'DL123456789',
        status: 'available',
        email: 'mike@tms.com',
        address: '123 Main St, City, State',
        isActive: true,
      },
      {
        name: 'Sarah Wilson',
        phone: '+1234567891',
        vehicle: 'Honda Accord - DEF456',
        licenseNumber: 'DL987654321',
        status: 'available',
        email: 'sarah@tms.com',
        address: '456 Oak Ave, City, State',
        isActive: true,
      },
      {
        name: 'David Brown',
        phone: '+1234567892',
        vehicle: 'Ford Focus - GHI789',
        licenseNumber: 'DL456789123',
        status: 'available',
        email: 'david@tms.com',
        address: '789 Pine St, City, State',
        isActive: true,
      },
      {
        name: 'Lisa Davis',
        phone: '+1234567893',
        vehicle: 'Nissan Altima - JKL012',
        licenseNumber: 'DL789123456',
        status: 'busy',
        email: 'lisa@tms.com',
        address: '321 Elm St, City, State',
        isActive: true,
      },
    ];

    const createdDrivers = await driverRepository.save(drivers);
    console.log('Drivers created:', createdDrivers.length);

    // Create orders
    const orders = [
      {
        customerName: 'Alice Smith',
        customerPhone: '+1987654321',
        pickupLocation: '123 Downtown St, City, State',
        dropoffLocation: '456 Airport Blvd, City, State',
        status: 'pending',
        priority: 'normal',
        description: 'Airport transfer',
        estimatedFare: 25.50,
        scheduledPickupTime: new Date('2024-01-15T10:00:00Z'),
      },
      {
        customerName: 'Bob Johnson',
        customerPhone: '+1987654322',
        pickupLocation: '789 Hotel Plaza, City, State',
        dropoffLocation: '321 Convention Center, City, State',
        status: 'assigned',
        priority: 'high',
        description: 'Business meeting transport',
        estimatedFare: 18.75,
        scheduledPickupTime: new Date('2024-01-15T14:30:00Z'),
        driverId: createdDrivers[3].id, // Lisa Davis
      },
      {
        customerName: 'Carol White',
        customerPhone: '+1987654323',
        pickupLocation: '654 Residential Ave, City, State',
        dropoffLocation: '987 Shopping Mall, City, State',
        status: 'completed',
        priority: 'normal',
        description: 'Shopping trip',
        estimatedFare: 12.00,
        actualFare: 12.00,
        scheduledPickupTime: new Date('2024-01-14T09:00:00Z'),
        actualPickupTime: new Date('2024-01-14T09:15:00Z'),
        actualDropoffTime: new Date('2024-01-14T10:30:00Z'),
        driverId: createdDrivers[0].id, // Mike Johnson
      },
      {
        customerName: 'Daniel Green',
        customerPhone: '+1987654324',
        pickupLocation: '147 Business District, City, State',
        dropoffLocation: '258 Train Station, City, State',
        status: 'in_progress',
        priority: 'urgent',
        description: 'Train station transfer',
        estimatedFare: 22.00,
        scheduledPickupTime: new Date('2024-01-15T16:00:00Z'),
        actualPickupTime: new Date('2024-01-15T16:05:00Z'),
        driverId: createdDrivers[1].id, // Sarah Wilson
      },
    ];

    const createdOrders = await orderRepository.save(orders);
    console.log('Orders created:', createdOrders.length);

    console.log('✅ Seed data created successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Username: admin, Password: password123 (Admin)');
    console.log('Username: manager, Password: password123 (Manager)');
    console.log('Username: dispatcher, Password: password123 (Dispatcher)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
