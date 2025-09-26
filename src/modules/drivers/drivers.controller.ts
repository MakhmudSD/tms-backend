import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver } from './driver.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Drivers')
@Controller('drivers')
// @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
// @ApiBearerAuth()
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @ApiOperation({ summary: 'Create a new driver' })
  @ApiResponse({ status: 201, description: 'Driver created successfully', type: Driver })
  @Post()
  async create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driversService.create(createDriverDto);
  }

  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({ status: 200, description: 'Drivers retrieved successfully', type: [Driver] })
  @Get()
  async findAll(): Promise<Driver[]> {
    return this.driversService.findAll();
  }

  @ApiOperation({ summary: 'Get all available drivers' })
  @ApiResponse({ status: 200, description: 'Available drivers retrieved successfully', type: [Driver] })
  @Get('available')
  async findAvailable(): Promise<Driver[]> {
    return this.driversService.findAvailable();
  }

  @ApiOperation({ summary: 'Get driver by ID' })
  @ApiResponse({ status: 200, description: 'Driver retrieved successfully', type: Driver })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Driver> {
    return this.driversService.findOne(id);
  }

  @ApiOperation({ summary: 'Get driver statistics' })
  @ApiResponse({ status: 200, description: 'Driver statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @Get(':id/stats')
  async getDriverStats(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.driversService.getDriverStats(id);
  }

  @ApiOperation({ summary: 'Update driver' })
  @ApiResponse({ status: 200, description: 'Driver updated successfully', type: Driver })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ): Promise<Driver> {
    return this.driversService.update(id, updateDriverDto);
  }

  @ApiOperation({ summary: 'Update driver status' })
  @ApiResponse({ status: 200, description: 'Driver status updated successfully', type: Driver })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ): Promise<Driver> {
    return this.driversService.updateStatus(id, status);
  }

  @ApiOperation({ summary: 'Delete driver (soft delete)' })
  @ApiResponse({ status: 200, description: 'Driver deleted successfully' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.driversService.remove(id);
    return { message: 'Driver deleted successfully' };
  }

  @ApiOperation({ summary: 'Permanently delete driver' })
  @ApiResponse({ status: 200, description: 'Driver permanently deleted' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  @Delete(':id/permanent')
  async permanentDelete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.driversService.permanentDelete(id);
    return { message: 'Driver permanently deleted' };
  }
}
