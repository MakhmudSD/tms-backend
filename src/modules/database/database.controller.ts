import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DatabaseService } from './database.service';

@ApiTags('Database')
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @ApiOperation({ summary: 'Get database connection status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Database connection status retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        connected: { type: 'boolean' },
        initialized: { type: 'boolean' },
      },
    },
  })
  @Get('status')
  async getConnectionStatus() {
    try {
      const status = this.databaseService.getConnectionStatus();
      return {
        success: true,
        message: 'Database connection status retrieved successfully',
        data: status,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to get database connection status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              user_id: { type: 'number' },
              login_id: { type: 'string' },
              user_name: { type: 'string' },
              email: { type: 'string' },
              phone_number: { type: 'string' },
              status_code: { type: 'string' },
              created_at: { type: 'string' },
              updated_at: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @Get('users')
  async getAllUsers() {
    try {
      const users = await this.databaseService.getAllUsers();
      return {
        success: true,
        message: `Retrieved ${users.length} users successfully`,
        data: users,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve users',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully',
  })
  @ApiResponse({ 
    status: 404, 
    description: 'User not found',
  })
  @Get('users/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.databaseService.getUserById(id);
      
      if (!user) {
        throw new HttpException(
          {
            success: false,
            message: `User with ID ${id} not found`,
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'User retrieved successfully',
        data: user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({ 
    status: 200, 
    description: 'Drivers retrieved successfully',
  })
  @Get('drivers')
  async getAllDrivers() {
    try {
      const drivers = await this.databaseService.getAllDrivers();
      return {
        success: true,
        message: `Retrieved ${drivers.length} drivers successfully`,
        data: drivers,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve drivers',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get driver by ID' })
  @ApiParam({ name: 'id', description: 'Driver ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Driver retrieved successfully',
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Driver not found',
  })
  @Get('drivers/:id')
  async getDriverById(@Param('id', ParseIntPipe) id: number) {
    try {
      const driver = await this.databaseService.getDriverById(id);
      
      if (!driver) {
        throw new HttpException(
          {
            success: false,
            message: `Driver with ID ${id} not found`,
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Driver retrieved successfully',
        data: driver,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve driver',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ 
    status: 200, 
    description: 'Orders retrieved successfully',
  })
  @Get('orders')
  async getAllOrders() {
    try {
      const orders = await this.databaseService.getAllOrders();
      return {
        success: true,
        message: `Retrieved ${orders.length} orders successfully`,
        data: orders,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve orders',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Order retrieved successfully',
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Order not found',
  })
  @Get('orders/:id')
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    try {
      const order = await this.databaseService.getOrderById(id);
      
      if (!order) {
        throw new HttpException(
          {
            success: false,
            message: `Order with ID ${id} not found`,
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Order retrieved successfully',
        data: order,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve order',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get orders by status' })
  @ApiParam({ name: 'status', description: 'Order status', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: 'Orders retrieved successfully',
  })
  @Get('orders/status/:status')
  async getOrdersByStatus(@Param('status') status: string) {
    try {
      const orders = await this.databaseService.getOrdersByStatus(status);
      return {
        success: true,
        message: `Retrieved ${orders.length} orders with status '${status}'`,
        data: orders,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve orders by status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get orders by driver ID' })
  @ApiParam({ name: 'driverId', description: 'Driver ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Orders retrieved successfully',
  })
  @Get('orders/driver/:driverId')
  async getOrdersByDriverId(@Param('driverId', ParseIntPipe) driverId: number) {
    try {
      const orders = await this.databaseService.getOrdersByDriverId(driverId);
      return {
        success: true,
        message: `Retrieved ${orders.length} orders for driver ID ${driverId}`,
        data: orders,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve orders for driver',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Get database statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'Database statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            users: { type: 'number' },
            drivers: { type: 'number' },
            orders: { type: 'number' },
            roles: { type: 'number' },
            connectionStatus: {
              type: 'object',
              properties: {
                connected: { type: 'boolean' },
                initialized: { type: 'boolean' },
              },
            },
          },
        },
      },
    },
  })
  @Get('stats')
  async getDatabaseStats() {
    try {
      const stats = await this.databaseService.getDatabaseStats();
      return {
        success: true,
        message: 'Database statistics retrieved successfully',
        data: stats,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve database statistics',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
