import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

/**
 * Role Service
 * Handles all role-related operations with clean separation of concerns
 */
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  /**
   * Get all roles
   */
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      order: { role_name: 'ASC' },
    });
  }

  /**
   * Get role by name
   */
  async findByName(roleName: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { role_name: roleName },
    });

    if (!role) {
      throw new NotFoundException(`Role '${roleName}' not found`);
    }

    return role;
  }

  /**
   * Get role by ID
   */
  async findById(roleId: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { role_id: roleId },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role;
  }

  /**
   * Create a new role
   */
  async create(roleName: string, description?: string): Promise<Role> {
    // Check if role already exists
    const existingRole = await this.roleRepository.findOne({
      where: { role_name: roleName },
    });

    if (existingRole) {
      throw new ConflictException(`Role '${roleName}' already exists`);
    }

    const role = this.roleRepository.create({
      role_name: roleName,
      description: description || `${roleName} role`,
    });

    return this.roleRepository.save(role);
  }

  /**
   * Initialize default roles if they don't exist
   */
  async initializeDefaultRoles(): Promise<void> {
    const defaultRoles = [
      { name: 'admin', description: 'System Administrator with full access' },
      { name: 'manager', description: 'Branch Manager with management privileges' },
      { name: 'dispatcher', description: 'Dispatcher with order management access' },
      { name: 'driver', description: 'Driver with limited access' },
    ];

    for (const roleData of defaultRoles) {
      try {
        await this.create(roleData.name, roleData.description);
        console.log(`✅ Role '${roleData.name}' created`);
      } catch (error) {
        if (error instanceof ConflictException) {
          console.log(`ℹ️  Role '${roleData.name}' already exists`);
        } else {
          console.error(`❌ Error creating role '${roleData.name}':`, error.message);
        }
      }
    }
  }

  /**
   * Check if admin role exists
   */
  async hasAdminRole(): Promise<boolean> {
    try {
      await this.findByName('admin');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get admin role
   */
  async getAdminRole(): Promise<Role> {
    return this.findByName('admin');
  }
}
