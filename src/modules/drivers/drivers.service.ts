import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private driversRepository: Repository<Driver>,
  ) {}

  /**
   * Create a new driver
   */
  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    const driver = this.driversRepository.create(createDriverDto);
    return this.driversRepository.save(driver);
  }

  /**
   * Get all drivers
   */
  async findAll(): Promise<Driver[]> {
    return this.driversRepository.find({
      relations: ['orders'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get all available drivers
   */
  async findAvailable(): Promise<Driver[]> {
    return this.driversRepository.find({
      where: { status: 'available', isActive: true },
      relations: ['orders'],
    });
  }

  /**
   * Get driver by ID
   */
  async findOne(id: number): Promise<Driver> {
    const driver = await this.driversRepository.findOne({
      where: { id },
      relations: ['orders'],
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return driver;
  }

  /**
   * Update driver
   */
  async update(id: number, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    const driver = await this.findOne(id);
    await this.driversRepository.update(id, updateDriverDto);
    return this.findOne(id);
  }

  /**
   * Delete driver (soft delete by setting isActive to false)
   */
  async remove(id: number): Promise<void> {
    const driver = await this.findOne(id);
    await this.driversRepository.update(id, { isActive: false });
  }

  /**
   * Permanently delete driver
   */
  async permanentDelete(id: number): Promise<void> {
    const driver = await this.findOne(id);
    await this.driversRepository.remove(driver);
  }

  /**
   * Update driver status
   */
  async updateStatus(id: number, status: string): Promise<Driver> {
    const driver = await this.findOne(id);
    await this.driversRepository.update(id, { status });
    return this.findOne(id);
  }

  /**
   * Get driver statistics
   */
  async getDriverStats(id: number): Promise<any> {
    const driver = await this.findOne(id);
    
    const totalOrders = driver.orders?.length || 0;
    const completedOrders = driver.orders?.filter(order => order.status === 'completed').length || 0;
    const pendingOrders = driver.orders?.filter(order => order.status === 'pending' || order.status === 'assigned').length || 0;

    return {
      driverId: id,
      driverName: driver.name,
      totalOrders,
      completedOrders,
      pendingOrders,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    };
  }
}
