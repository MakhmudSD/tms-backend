import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../users/role.entity';
import { Driver } from '../drivers/driver.entity';
import { Order } from '../orders/order.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  /**
   * Check database connection status
   */
  async checkConnectionStatus() {
    try {
      await this.dataSource.query('SELECT 1');
      console.log('✅ Database connection established successfully');
      return { connected: true, initialized: this.dataSource.isInitialized };
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return { connected: false, initialized: this.dataSource.isInitialized, error: error.message };
    }
  }

  /**
   * Get all users with their roles
   */
  async getAllUsers(): Promise<User[]> {
    try {
      if (!(await this.checkConnectionStatus()).connected) {
        throw new InternalServerErrorException('Database not connected.');
      }
      const users = await this.usersRepository.find({ relations: ['role'] });
      console.log(`✅ Fetched ${users.length} users from database`);
      return users;
    } catch (error) {
      console.error('Failed to fetch users:', error.message);
      throw new InternalServerErrorException(`Failed to retrieve users: ${error.message}`);
    }
  }

  /**
   * Get user by ID with their role
   */
  async getUserById(id: number): Promise<User> {
    try {
      if (!(await this.checkConnectionStatus()).connected) {
        throw new InternalServerErrorException('Database not connected.');
      }
      const user = await this.usersRepository.findOne({ 
        where: { user_id: id }, 
        relations: ['role'] 
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Failed to fetch user with ID ${id}:`, error.message);
      throw new InternalServerErrorException(`Failed to retrieve user: ${error.message}`);
    }
  }

  /**
   * Get all drivers with their assigned orders
   */
  async getAllDrivers(): Promise<Driver[]> {
    try {
      if (!(await this.checkConnectionStatus()).connected) {
        throw new InternalServerErrorException('Database not connected.');
      }
      const drivers = await this.driversRepository.find({ relations: ['orders'] });
      console.log(`✅ Fetched ${drivers.length} drivers from database`);
      return drivers;
    } catch (error) {
      console.error('Failed to fetch drivers:', error.message);
      throw new InternalServerErrorException(`Failed to retrieve drivers: ${error.message}`);
    }
  }

  /**
   * Get driver by ID with their assigned orders
   */
  async getDriverById(id: number): Promise<Driver> {
    try {
      if (!(await this.checkConnectionStatus()).connected) {
        throw new InternalServerErrorException('Database not connected.');
      }
      const driver = await this.driversRepository.findOne({ 
        where: { id }, 
        relations: ['orders'] 
      });
      if (!driver) {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }
      return driver;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Failed to fetch driver with ID ${id}:`, error.message);
      throw new InternalServerErrorException(`Failed to retrieve driver: ${error.message}`);
    }
  }

  /**
   * Get all orders with their assigned drivers
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      if (!(await this.checkConnectionStatus()).connected) {
        throw new InternalServerErrorException('Database not connected.');
      }
      const orders = await this.ordersRepository.find({ relations: ['driver'] });
      console.log(`✅ Fetched ${orders.length} orders from database`);
      return orders;
    } catch (error) {
      console.error('Failed to fetch orders:', error.message);
      throw new InternalServerErrorException(`Failed to retrieve orders: ${error.message}`);
    }
  }

  /**
   * Get order by ID with its assigned driver
   */
  async getOrderById(id: number): Promise<Order> {
    try {
      if (!(await this.checkConnectionStatus()).connected) {
        throw new InternalServerErrorException('Database not connected.');
      }
      const order = await this.ordersRepository.findOne({ 
        where: { id }, 
        relations: ['driver'] 
      });
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Failed to fetch order with ID ${id}:`, error.message);
      throw new InternalServerErrorException(`Failed to retrieve order: ${error.message}`);
    }
  }

  /**
   * Get orders by status
   */
  async getOrdersByStatus(status: string): Promise<Order[]> {
    try {
      if (!(await this.checkConnectionStatus()).connected) {
        throw new InternalServerErrorException('Database not connected.');
      }
      return this.ordersRepository.find({ 
        where: { status }, 
        relations: ['driver'] 
      });
    } catch (error) {
      console.error(`Failed to fetch orders with status ${status}:`, error.message);
      throw new InternalServerErrorException(`Failed to retrieve orders by status: ${error.message}`);
    }
  }

  /**
   * Get orders by driver ID
   */
  async getOrdersByDriverId(driverId: number): Promise<Order[]> {
    try {
      if (!(await this.checkConnectionStatus()).connected) {
        throw new InternalServerErrorException('Database not connected.');
      }
      return this.ordersRepository.find({ 
        where: { driverId }, 
        relations: ['driver'] 
      });
    } catch (error) {
      console.error(`Failed to fetch orders for driver ID ${driverId}:`, error.message);
      throw new InternalServerErrorException(`Failed to retrieve orders by driver ID: ${error.message}`);
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats() {
    try {
      if (!(await this.checkConnectionStatus()).connected) {
        throw new InternalServerErrorException('Database not connected.');
      }
      const usersCount = await this.usersRepository.count();
      const driversCount = await this.driversRepository.count();
      const ordersCount = await this.ordersRepository.count();
      const rolesCount = await this.rolesRepository.count();

      return {
        users: usersCount,
        drivers: driversCount,
        orders: ordersCount,
        roles: rolesCount,
        connectionStatus: await this.checkConnectionStatus(),
      };
    } catch (error) {
      console.error('Failed to fetch database statistics:', error.message);
      throw new InternalServerErrorException(`Failed to retrieve database statistics: ${error.message}`);
    }
  }
}