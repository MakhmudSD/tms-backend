import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

// Load environment variables
config();

// Import entities
import { User } from '../modules/users/user.entity';
import { Role } from '../modules/users/role.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [User, Role],
  synchronize: false,
  logging: false,
});

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize the data source
    await dataSource.initialize();
    console.log('✅ Database connection established');

    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    // Check if admin role exists, if not create it
    let adminRole = await roleRepository.findOne({ where: { role_name: 'admin' } });
    if (!adminRole) {
      adminRole = roleRepository.create({
        role_name: 'admin',
        description: 'System Administrator',
      });
      await roleRepository.save(adminRole);
      console.log('✅ Admin role created');
    }

    // Check if admin user exists
    const existingAdmin = await userRepository.findOne({ 
      where: { email: 'admin@example.com' } 
    });
    
    if (existingAdmin) {
      // Update existing admin user with correct password
      const hashedPassword = await bcrypt.hash('password123', 10);
      existingAdmin.password_hash = hashedPassword;
      await userRepository.save(existingAdmin);
      console.log('✅ Admin user updated with new password');
      console.log('   Email: admin@example.com');
      console.log('   Password: password123');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const adminUser = userRepository.create({
        login_id: 'admin@example.com',
        password_hash: hashedPassword,
        user_name: 'System Administrator',
        email: 'admin@example.com',
        phone_number: '010-0000-0000',
        role_id: adminRole.role_id,
        status_code: 'ACTIVE',
      });

      await userRepository.save(adminUser);
      console.log('✅ Admin user created successfully');
      console.log('   Email: admin@example.com');
      console.log('   Password: password123');
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    // Close the data source
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the seed function
seed();
