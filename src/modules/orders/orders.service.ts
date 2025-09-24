import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order } from './order.entity';
import { Driver } from '../drivers/driver.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AssignDriverDto } from './dto/assign-driver.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
  ) {}

  /**
   * Create a new order
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create(createOrderDto);
    return this.ordersRepository.save(order);
  }

  /**
   * Get all orders
   */
  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['driver'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get orders by status
   */
  async findByStatus(status: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { status },
      relations: ['driver'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get orders by driver
   */
  async findByDriver(driverId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { driverId },
      relations: ['driver'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get order by ID
   */
  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['driver'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  /**
   * Update order
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    await this.ordersRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  /**
   * Assign driver to order
   */
  async assignDriver(id: number, assignDriverDto: AssignDriverDto): Promise<Order> {
    const order = await this.findOne(id);
    
    // Check if driver exists
    const driver = await this.driversRepository.findOne({
      where: { id: assignDriverDto.driverId, isActive: true }
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${assignDriverDto.driverId} not found`);
    }

    // Check if driver is available
    if (driver.status !== 'available') {
      throw new BadRequestException('Driver is not available');
    }

    // Update order with driver assignment
    await this.ordersRepository.update(id, {
      driverId: assignDriverDto.driverId,
      status: 'assigned',
    });

    // Update driver status to busy
    await this.driversRepository.update(assignDriverDto.driverId, {
      status: 'busy',
    });

    return this.findOne(id);
  }

  /**
   * Update order status
   */
  async updateStatus(id: number, status: string): Promise<Order> {
    const order = await this.findOne(id);
    
    // If order is being completed, update driver status back to available
    if (status === 'completed' && order.driverId) {
      await this.driversRepository.update(order.driverId, {
        status: 'available',
      });
    }

    await this.ordersRepository.update(id, { status });
    return this.findOne(id);
  }

  /**
   * Delete order
   */
  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);
    
    // If order has a driver assigned, make driver available again
    if (order.driverId) {
      await this.driversRepository.update(order.driverId, {
        status: 'available',
      });
    }

    await this.ordersRepository.remove(order);
  }

  /**
   * Get order statistics
   */
  async getOrderStats(): Promise<any> {
    const totalOrders = await this.ordersRepository.count();
    const pendingOrders = await this.ordersRepository.count({ where: { status: 'pending' } });
    const assignedOrders = await this.ordersRepository.count({ where: { status: 'assigned' } });
    const inProgressOrders = await this.ordersRepository.count({ where: { status: 'in_progress' } });
    const completedOrders = await this.ordersRepository.count({ where: { status: 'completed' } });
    const cancelledOrders = await this.ordersRepository.count({ where: { status: 'cancelled' } });

    return {
      totalOrders,
      pendingOrders,
      assignedOrders,
      inProgressOrders,
      completedOrders,
      cancelledOrders,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    };
  }

  /**
   * Get orders for tracking (public endpoint)
   */
  async getOrdersForTracking(): Promise<Order[]> {
    return this.ordersRepository.find({
      select: ['id', 'customerName', 'pickupLocation', 'dropoffLocation', 'status', 'estimatedFare', 'scheduledPickupTime'],
      relations: ['driver'],
      where: { status: In(['assigned', 'in_progress']) },
      order: { createdAt: 'DESC' },
    });
  }
}
