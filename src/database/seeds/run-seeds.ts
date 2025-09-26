import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

// Import entities
import { User } from '../../modules/users/user.entity';
import { Role } from '../../modules/users/role.entity';

config();

/**
 * Database Seeding Service
 * 
 * This service seeds the database with initial data including:
 * - Default roles (admin, manager, dispatcher, driver)
 * - Admin user with login credentials
 * 
 * Admin Login Credentials:
 * - Username: admin
 * - Password: admin123
 */
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'tms_database',
  entities: [User, Role],
  synchronize: false,
  logging: false,
});

/**
 * Seed default roles
 */
async function seedRoles(dataSource: DataSource): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);
  
  const roles = [
    { role_name: 'admin', description: 'System Administrator with full access' },
    { role_name: 'manager', description: 'Branch Manager with management privileges' },
    { role_name: 'dispatcher', description: 'Dispatcher with order management access' },
    { role_name: 'driver', description: 'Driver with limited access' },
  ];

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({ where: { role_name: roleData.role_name } });
    if (!existingRole) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`✅ Role '${roleData.role_name}' created`);
    } else {
      console.log(`ℹ️  Role '${roleData.role_name}' already exists`);
    }
  }
}

/**
 * Seed admin user
 */
async function seedAdminUser(dataSource: DataSource): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  // Get admin role
  const adminRole = await roleRepository.findOne({ where: { role_name: 'admin' } });
  if (!adminRole) {
    throw new Error('Admin role not found. Please run role seeding first.');
  }

  // Check if admin user already exists
  const existingAdmin = await userRepository.findOne({ 
    where: { login_id: 'admin' } 
  });
  
  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = userRepository.create({
    login_id: 'admin',
    password_hash: hashedPassword,
    user_name: 'System Administrator',
    email: 'admin@tms.com',
    phone_number: '010-0000-0000',
    role_id: adminRole.role_id,
    status_code: 'ACTIVE',
  });

  await userRepository.save(adminUser);
  console.log('✅ Admin user created successfully');
  console.log('   Username: admin');
  console.log('   Password: admin123');
}

/**
 * Main seeding function
 */
async function runSeeds() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Run all seed functions in order
    await seedRoles(dataSource);
    await seedAdminUser(dataSource);

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Summary of seeded data:');
    console.log('   ✅ User roles (admin, manager, dispatcher, driver)');
    console.log('   ✅ Admin user with login credentials');
    console.log('');
    console.log('🔑 Admin Login Credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('');
    console.log('🚀 The TMS system is now ready for use!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  runSeeds();
}

export { runSeeds };