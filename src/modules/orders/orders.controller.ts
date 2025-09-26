import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  ParseIntPipe,
  Query 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { Order } from './order.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully', type: Order })
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: [Order] })
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Get orders by status' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: [Order] })
  @Get('status/:status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findByStatus(@Param('status') status: string): Promise<Order[]> {
    return this.ordersService.findByStatus(status);
  }

  @ApiOperation({ summary: 'Get orders by driver' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully', type: [Order] })
  @Get('driver/:driverId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findByDriver(@Param('driverId', ParseIntPipe) driverId: number): Promise<Order[]> {
    return this.ordersService.findByDriver(driverId);
  }

  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({ status: 200, description: 'Order statistics retrieved successfully' })
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOrderStats(): Promise<any> {
    return this.ordersService.getOrderStats();
  }

  @ApiOperation({ summary: 'Get orders for tracking (public)' })
  @ApiResponse({ status: 200, description: 'Orders for tracking retrieved successfully', type: [Order] })
  @Get('tracking')
  async getOrdersForTracking(): Promise<Order[]> {
    return this.ordersService.getOrdersForTracking();
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({ status: 200, description: 'Order updated successfully', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Patch(':id')
  // @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
  // @ApiBearerAuth()
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Assign driver to order' })
  @ApiResponse({ status: 200, description: 'Driver assigned successfully', type: Order })
  @ApiResponse({ status: 404, description: 'Order or driver not found' })
  @ApiResponse({ status: 400, description: 'Driver is not available' })
  @Patch(':id/assign-driver')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async assignDriver(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignDriverDto: AssignDriverDto,
  ): Promise<Order> {
    return this.ordersService.assignDriver(id, assignDriverDto);
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ): Promise<Order> {
    return this.ordersService.updateStatus(id, status);
  }

  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.ordersService.remove(id);
    return { message: 'Order deleted successfully' };
  }
}
