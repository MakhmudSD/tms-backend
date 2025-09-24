import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body, 
  Query, 
  ParseIntPipe,
  UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KoreanTmsService } from './korean-tms.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Branch } from './branch.entity';
import { Client } from './client.entity';
import { Asset } from './asset.entity';
import { Waypoint } from './waypoint.entity';
import { Settlement } from './settlement.entity';

@ApiTags('Korean TMS')
@Controller('korean-tms')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KoreanTmsController {
  constructor(private readonly koreanTmsService: KoreanTmsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get comprehensive Korean TMS statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats() {
    try {
      const stats = await this.koreanTmsService.getKoreanTmsStats();
      return { 
        success: true, 
        message: 'Korean TMS statistics retrieved successfully', 
        data: stats 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Get('branches')
  @ApiOperation({ summary: 'Get all branches with enhanced data' })
  @ApiResponse({ status: 200, description: 'Branches retrieved successfully', type: [Branch] })
  async getBranches() {
    try {
      const branches = await this.koreanTmsService.getAllBranches();
      return { 
        success: true, 
        message: `Retrieved ${branches.length} branches successfully`, 
        data: branches 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Post('branches')
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({ status: 201, description: 'Branch created successfully', type: Branch })
  async createBranch(@Body() branchData: Partial<Branch>) {
    try {
      const branch = await this.koreanTmsService.createBranch(branchData);
      return { 
        success: true, 
        message: 'Branch created successfully', 
        data: branch 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Get('clients')
  @ApiOperation({ summary: 'Get all clients with enhanced data' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully', type: [Client] })
  async getClients() {
    try {
      const clients = await this.koreanTmsService.getAllClients();
      return { 
        success: true, 
        message: `Retrieved ${clients.length} clients successfully`, 
        data: clients 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Post('clients')
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({ status: 201, description: 'Client created successfully', type: Client })
  async createClient(@Body() clientData: Partial<Client>) {
    try {
      const client = await this.koreanTmsService.createClient(clientData);
      return { 
        success: true, 
        message: 'Client created successfully', 
        data: client 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Get('assets')
  @ApiOperation({ summary: 'Get all assets with enhanced data' })
  @ApiResponse({ status: 200, description: 'Assets retrieved successfully', type: [Asset] })
  async getAssets() {
    try {
      const assets = await this.koreanTmsService.getAllAssets();
      return { 
        success: true, 
        message: `Retrieved ${assets.length} assets successfully`, 
        data: assets 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Get('assets/status/:status')
  @ApiOperation({ summary: 'Get assets by status' })
  @ApiResponse({ status: 200, description: 'Assets retrieved successfully', type: [Asset] })
  async getAssetsByStatus(@Param('status') status: string) {
    try {
      const assets = await this.koreanTmsService.getAssetsByStatus(status);
      return { 
        success: true, 
        message: `Retrieved ${assets.length} assets with status '${status}'`, 
        data: assets 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Post('assets')
  @ApiOperation({ summary: 'Create a new asset' })
  @ApiResponse({ status: 201, description: 'Asset created successfully', type: Asset })
  async createAsset(@Body() assetData: Partial<Asset>) {
    try {
      const asset = await this.koreanTmsService.createAsset(assetData);
      return { 
        success: true, 
        message: 'Asset created successfully', 
        data: asset 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Put('assets/:id/status')
  @ApiOperation({ summary: 'Update asset status' })
  @ApiResponse({ status: 200, description: 'Asset status updated successfully', type: Asset })
  async updateAssetStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string
  ) {
    try {
      const asset = await this.koreanTmsService.updateAssetStatus(id, status);
      return { 
        success: true, 
        message: 'Asset status updated successfully', 
        data: asset 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Get('waypoints')
  @ApiOperation({ summary: 'Get all waypoints with enhanced data' })
  @ApiResponse({ status: 200, description: 'Waypoints retrieved successfully', type: [Waypoint] })
  async getWaypoints() {
    try {
      const waypoints = await this.koreanTmsService.getAllWaypoints();
      return { 
        success: true, 
        message: `Retrieved ${waypoints.length} waypoints successfully`, 
        data: waypoints 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Post('waypoints')
  @ApiOperation({ summary: 'Create a new waypoint' })
  @ApiResponse({ status: 201, description: 'Waypoint created successfully', type: Waypoint })
  async createWaypoint(@Body() waypointData: Partial<Waypoint>) {
    try {
      const waypoint = await this.koreanTmsService.createWaypoint(waypointData);
      return { 
        success: true, 
        message: 'Waypoint created successfully', 
        data: waypoint 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Get('settlements')
  @ApiOperation({ summary: 'Get all settlements with enhanced data' })
  @ApiResponse({ status: 200, description: 'Settlements retrieved successfully', type: [Settlement] })
  async getSettlements() {
    try {
      const settlements = await this.koreanTmsService.getAllSettlements();
      return { 
        success: true, 
        message: `Retrieved ${settlements.length} settlements successfully`, 
        data: settlements 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Get('settlements/status/:status')
  @ApiOperation({ summary: 'Get settlements by status' })
  @ApiResponse({ status: 200, description: 'Settlements retrieved successfully', type: [Settlement] })
  async getSettlementsByStatus(@Param('status') status: string) {
    try {
      const settlements = await this.koreanTmsService.getSettlementsByStatus(status);
      return { 
        success: true, 
        message: `Retrieved ${settlements.length} settlements with status '${status}'`, 
        data: settlements 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Post('settlements')
  @ApiOperation({ summary: 'Create a new settlement' })
  @ApiResponse({ status: 201, description: 'Settlement created successfully', type: Settlement })
  async createSettlement(@Body() settlementData: Partial<Settlement>) {
    try {
      const settlement = await this.koreanTmsService.createSettlement(settlementData);
      return { 
        success: true, 
        message: 'Settlement created successfully', 
        data: settlement 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }

  @Get('daily-stats')
  @ApiOperation({ summary: 'Get daily statistics' })
  @ApiResponse({ status: 200, description: 'Daily statistics retrieved successfully' })
  async getDailyStats(@Query('date') date?: string) {
    try {
      const targetDate = date ? new Date(date) : undefined;
      const stats = await this.koreanTmsService.getDailyStats(targetDate);
      return { 
        success: true, 
        message: 'Daily statistics retrieved successfully', 
        data: stats 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message, 
        data: null 
      };
    }
  }
}