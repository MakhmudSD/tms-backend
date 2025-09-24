import { Controller, Get, Param, ParseIntPipe, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DatabaseService } from './database.service';
import { User } from '../users/user.entity';
import { Driver } from '../drivers/driver.entity';
import { Order } from '../orders/order.entity';

@ApiTags('Database')
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get database connection status' })
  @ApiResponse({ status: 200, description: 'Database connection status retrieved successfully' })
  async getStatus() {
    const status = await this.databaseService.checkConnectionStatus();
    return { success: true, message: 'Database connection status retrieved successfully', data: status };
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with their roles' })
  @ApiResponse({ status: 200, description: 'Retrieved all users successfully', type: [User] })
  async getAllUsers() {
    try {
      const users = await this.databaseService.getAllUsers();
      return { success: true, message: `Retrieved ${users.length} users successfully`, data: users };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID with their role' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.databaseService.getUserById(id);
      return { success: true, message: 'User retrieved successfully', data: user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('drivers')
  @ApiOperation({ summary: 'Get all drivers with their assigned orders' })
  @ApiResponse({ status: 200, description: 'Retrieved all drivers successfully', type: [Driver] })
  async getAllDrivers() {
    try {
      const drivers = await this.databaseService.getAllDrivers();
      return { success: true, message: `Retrieved ${drivers.length} drivers successfully`, data: drivers };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('drivers/:id')
  @ApiOperation({ summary: 'Get driver by ID with their assigned orders' })
  @ApiResponse({ status: 200, description: 'Driver retrieved successfully', type: Driver })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async getDriverById(@Param('id', ParseIntPipe) id: number) {
    try {
      const driver = await this.databaseService.getDriverById(id);
      return { success: true, message: 'Driver retrieved successfully', data: driver };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders with their assigned drivers' })
  @ApiResponse({ status: 200, description: 'Retrieved all orders successfully', type: [Order] })
  async getAllOrders() {
    try {
      const orders = await this.databaseService.getAllOrders();
      return { success: true, message: `Retrieved ${orders.length} orders successfully`, data: orders };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order by ID with its assigned driver' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    try {
      const order = await this.databaseService.getOrderById(id);
      return { success: true, message: 'Order retrieved successfully', data: order };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('orders/status/:status')
  @ApiOperation({ summary: 'Get orders by status' })
  @ApiResponse({ status: 200, description: 'Retrieved orders by status successfully', type: [Order] })
  async getOrdersByStatus(@Param('status') status: string) {
    try {
      const orders = await this.databaseService.getOrdersByStatus(status);
      return { success: true, message: `Retrieved ${orders.length} orders with status '${status}'`, data: orders };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('orders/driver/:driverId')
  @ApiOperation({ summary: 'Get orders by driver ID' })
  @ApiResponse({ status: 200, description: 'Retrieved orders by driver ID successfully', type: [Order] })
  async getOrdersByDriverId(@Param('driverId', ParseIntPipe) driverId: number) {
    try {
      const orders = await this.databaseService.getOrdersByDriverId(driverId);
      return { success: true, message: `Retrieved ${orders.length} orders for driver ID ${driverId}`, data: orders };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get database statistics' })
  @ApiResponse({ status: 200, description: 'Database statistics retrieved successfully' })
  async getDatabaseStats() {
    try {
      const stats = await this.databaseService.getDatabaseStats();
      return { success: true, message: 'Database statistics retrieved successfully', data: stats };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}