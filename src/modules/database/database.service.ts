import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../users/role.entity';
import { Driver } from '../drivers/driver.entity';
import { Order } from '../orders/order.entity';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private isConnected = false;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.checkConnection();
  }

  /**
   * Check if database connection exists and is active
   */
  async checkConnection(): Promise<boolean> {
    try {
      if (this.isConnected && this.dataSource.isInitialized) {
        this.logger.log('✅ Database connection already exists and is active');
        return true;
      }

      // Test the connection
      await this.dataSource.query('SELECT 1');
      this.isConnected = true;
      this.logger.log('✅ Database connection established successfully');
      return true;
    } catch (error) {
      this.isConnected = false;
      this.logger.error('❌ Database connection failed:', error.message);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): { connected: boolean; initialized: boolean } {
    return {
      connected: this.isConnected,
      initialized: this.dataSource.isInitialized,
    };
  }

  /**
   * Fetch all users with their roles
   */
  async getAllUsers(): Promise<User[]> {
    try {
      await this.checkConnection();
      const users = await this.userRepository.find({
        relations: ['role'],
        select: [
          'user_id',
          'login_id',
          'user_name',
          'email',
          'phone_number',
          'status_code',
          'created_at',
          'updated_at',
        ],
      });
      this.logger.log(`✅ Fetched ${users.length} users from database`);
      return users;
    } catch (error) {
      this.logger.error('❌ Error fetching users:', error.message);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  /**
   * Fetch user by ID
   */
  async getUserById(id: number): Promise<User | null> {
    try {
      await this.checkConnection();
      const user = await this.userRepository.findOne({
        where: { user_id: id },
        relations: ['role'],
        select: [
          'user_id',
          'login_id',
          'user_name',
          'email',
          'phone_number',
          'status_code',
          'created_at',
          'updated_at',
        ],
      });
      
      if (user) {
        this.logger.log(`✅ Fetched user with ID ${id}`);
      } else {
        this.logger.warn(`⚠️ User with ID ${id} not found`);
      }
      
      return user;
    } catch (error) {
      this.logger.error(`❌ Error fetching user with ID ${id}:`, error.message);
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  /**
   * Fetch all drivers
   */
  async getAllDrivers(): Promise<Driver[]> {
    try {
      await this.checkConnection();
      const drivers = await this.driverRepository.find({
        relations: ['orders'],
        order: { id: 'ASC' },
      });
      this.logger.log(`✅ Fetched ${drivers.length} drivers from database`);
      return drivers;
    } catch (error) {
      this.logger.error('❌ Error fetching drivers:', error.message);
      throw new Error(`Failed to fetch drivers: ${error.message}`);
    }
  }

  /**
   * Fetch driver by ID
   */
  async getDriverById(id: number): Promise<Driver | null> {
    try {
      await this.checkConnection();
      const driver = await this.driverRepository.findOne({
        where: { id },
        relations: ['orders'],
      });
      
      if (driver) {
        this.logger.log(`✅ Fetched driver with ID ${id}`);
      } else {
        this.logger.warn(`⚠️ Driver with ID ${id} not found`);
      }
      
      return driver;
    } catch (error) {
      this.logger.error(`❌ Error fetching driver with ID ${id}:`, error.message);
      throw new Error(`Failed to fetch driver: ${error.message}`);
    }
  }

  /**
   * Fetch all orders with driver information
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      await this.checkConnection();
      const orders = await this.orderRepository.find({
        relations: ['driver'],
        order: { id: 'ASC' },
      });
      this.logger.log(`✅ Fetched ${orders.length} orders from database`);
      return orders;
    } catch (error) {
      this.logger.error('❌ Error fetching orders:', error.message);
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  /**
   * Fetch order by ID
   */
  async getOrderById(id: number): Promise<Order | null> {
    try {
      await this.checkConnection();
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['driver'],
      });
      
      if (order) {
        this.logger.log(`✅ Fetched order with ID ${id}`);
      } else {
        this.logger.warn(`⚠️ Order with ID ${id} not found`);
      }
      
      return order;
    } catch (error) {
      this.logger.error(`❌ Error fetching order with ID ${id}:`, error.message);
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  /**
   * Fetch orders by status
   */
  async getOrdersByStatus(status: string): Promise<Order[]> {
    try {
      await this.checkConnection();
      const orders = await this.orderRepository.find({
        where: { status },
        relations: ['driver'],
        order: { id: 'ASC' },
      });
      this.logger.log(`✅ Fetched ${orders.length} orders with status '${status}'`);
      return orders;
    } catch (error) {
      this.logger.error(`❌ Error fetching orders by status '${status}':`, error.message);
      throw new Error(`Failed to fetch orders by status: ${error.message}`);
    }
  }

  /**
   * Fetch orders by driver ID
   */
  async getOrdersByDriverId(driverId: number): Promise<Order[]> {
    try {
      await this.checkConnection();
      const orders = await this.orderRepository.find({
        where: { driverId },
        relations: ['driver'],
        order: { id: 'ASC' },
      });
      this.logger.log(`✅ Fetched ${orders.length} orders for driver ID ${driverId}`);
      return orders;
    } catch (error) {
      this.logger.error(`❌ Error fetching orders for driver ID ${driverId}:`, error.message);
      throw new Error(`Failed to fetch orders for driver: ${error.message}`);
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<{
    users: number;
    drivers: number;
    orders: number;
    roles: number;
    connectionStatus: { connected: boolean; initialized: boolean };
  }> {
    try {
      await this.checkConnection();
      
      const [userCount, driverCount, orderCount, roleCount] = await Promise.all([
        this.userRepository.count(),
        this.driverRepository.count(),
        this.orderRepository.count(),
        this.roleRepository.count(),
      ]);

      const stats = {
        users: userCount,
        drivers: driverCount,
        orders: orderCount,
        roles: roleCount,
        connectionStatus: this.getConnectionStatus(),
      };

      this.logger.log('✅ Database statistics retrieved successfully');
      return stats;
    } catch (error) {
      this.logger.error('❌ Error fetching database statistics:', error.message);
      throw new Error(`Failed to fetch database statistics: ${error.message}`);
    }
  }
}
