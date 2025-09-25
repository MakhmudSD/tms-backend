import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../modules/users/user.entity';
import { Role } from '../../modules/users/role.entity';

export async function seedUsers(dataSource: DataSource): Promise<void> {
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
    where: { login_id: 'admin@example.com' } 
  });
  
  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
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
  console.log('   Password: admin123');
}
