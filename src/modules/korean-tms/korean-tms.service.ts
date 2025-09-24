import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Branch } from './branch.entity';
import { Client } from './client.entity';
import { Asset } from './asset.entity';
import { Waypoint } from './waypoint.entity';
import { Settlement } from './settlement.entity';

@Injectable()
export class KoreanTmsService {
  constructor(
    @InjectRepository(Branch)
    private branchesRepository: Repository<Branch>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
    @InjectRepository(Waypoint)
    private waypointsRepository: Repository<Waypoint>,
    @InjectRepository(Settlement)
    private settlementsRepository: Repository<Settlement>,
  ) {}

  /**
   * Get comprehensive Korean TMS statistics
   */
  async getKoreanTmsStats() {
    try {
      const [
        totalBranches,
        totalClients,
        totalAssets,
        totalWaypoints,
        totalSettlements,
        availableAssets,
        assignedAssets,
        maintenanceAssets,
        pendingSettlements,
        completedSettlements,
        totalAmount
      ] = await Promise.all([
        this.branchesRepository.count(),
        this.clientsRepository.count(),
        this.assetsRepository.count(),
        this.waypointsRepository.count(),
        this.settlementsRepository.count(),
        this.assetsRepository.count({ where: { status: 'AVAILABLE' } }),
        this.assetsRepository.count({ where: { status: 'ASSIGNED' } }),
        this.assetsRepository.count({ where: { status: 'MAINTENANCE' } }),
        this.settlementsRepository.count({ where: { status: 'PENDING' } }),
        this.settlementsRepository.count({ where: { status: 'COMPLETED' } }),
        this.settlementsRepository
          .createQueryBuilder('settlement')
          .select('SUM(settlement.amount)', 'total')
          .getRawOne()
      ]);

      return {
        branches: totalBranches,
        clients: totalClients,
        assets: totalAssets,
        waypoints: totalWaypoints,
        settlements: totalSettlements,
        availableAssets,
        assignedAssets,
        maintenanceAssets,
        pendingSettlements,
        completedSettlements,
        totalAmount: totalAmount?.total || 0,
        orders: totalSettlements, // Using settlements as proxy for orders
        pendingOrders: pendingSettlements,
        inTransitOrders: assignedAssets,
        completedOrders: completedSettlements,
        emergencyOrders: 0 // Would need separate emergency tracking
      };
    } catch (error) {
      console.error('Error fetching Korean TMS stats:', error);
      throw new BadRequestException('Failed to fetch statistics');
    }
  }

  /**
   * Get all branches with enhanced data
   */
  async getAllBranches() {
    try {
      const branches = await this.branchesRepository.find({
        order: { branch_name: 'ASC' }
      });
      
      // Add asset count for each branch
      const branchesWithStats = await Promise.all(
        branches.map(async (branch) => {
          const assetCount = await this.assetsRepository.count({
            where: { branch_id: branch.branch_id }
          });
          return {
            ...branch,
            assetCount
          };
        })
      );

      return branchesWithStats;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw new BadRequestException('Failed to fetch branches');
    }
  }

  /**
   * Get all clients with enhanced data
   */
  async getAllClients() {
    try {
      const clients = await this.clientsRepository.find({
        order: { client_name: 'ASC' }
      });
      
      // Add settlement count for each client
      const clientsWithStats = await Promise.all(
        clients.map(async (client) => {
          const settlementCount = await this.settlementsRepository.count({
            where: { settlement_id: client.client_id } // Using settlement_id instead
          });
          return {
            ...client,
            settlementCount
          };
        })
      );

      return clientsWithStats;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw new BadRequestException('Failed to fetch clients');
    }
  }

  /**
   * Get all assets with enhanced data
   */
  async getAllAssets() {
    try {
      const assets = await this.assetsRepository.find({
        order: { license_plate: 'ASC' }
      });
      
      // Add current order information for each asset
      const assetsWithOrders = await Promise.all(
        assets.map(async (asset) => {
          // Find if this asset has any active settlements (proxy for orders)
          const activeSettlement = await this.settlementsRepository.findOne({
            where: { 
              settlement_id: asset.asset_id, // Using settlement_id instead
              status: 'PENDING'
            }
          });
          
          return {
            ...asset,
            currentOrder: activeSettlement ? {
              id: activeSettlement.settlement_id,
              status: 'in_progress',
              pickupLocation: '픽업 위치',
              dropoffLocation: '배송 위치'
            } : null
          };
        })
      );

      return assetsWithOrders;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw new BadRequestException('Failed to fetch assets');
    }
  }

  /**
   * Get all waypoints with enhanced data
   */
  async getAllWaypoints() {
    try {
      const waypoints = await this.waypointsRepository.find({
        order: { waypoint_name: 'ASC' }
      });
      
      return waypoints;
    } catch (error) {
      console.error('Error fetching waypoints:', error);
      throw new BadRequestException('Failed to fetch waypoints');
    }
  }

  /**
   * Get all settlements with enhanced data
   */
  async getAllSettlements() {
    try {
      const settlements = await this.settlementsRepository.find({
        order: { settlement_date: 'DESC' }
      });
      
      return settlements;
    } catch (error) {
      console.error('Error fetching settlements:', error);
      throw new BadRequestException('Failed to fetch settlements');
    }
  }

  /**
   * Create a new branch
   */
  async createBranch(branchData: Partial<Branch>) {
    try {
      const branch = this.branchesRepository.create(branchData);
      return await this.branchesRepository.save(branch);
    } catch (error) {
      console.error('Error creating branch:', error);
      throw new BadRequestException('Failed to create branch');
    }
  }

  /**
   * Create a new client
   */
  async createClient(clientData: Partial<Client>) {
    try {
      const client = this.clientsRepository.create(clientData);
      return await this.clientsRepository.save(client);
    } catch (error) {
      console.error('Error creating client:', error);
      throw new BadRequestException('Failed to create client');
    }
  }

  /**
   * Create a new asset
   */
  async createAsset(assetData: Partial<Asset>) {
    try {
      const asset = this.assetsRepository.create(assetData);
      return await this.assetsRepository.save(asset);
    } catch (error) {
      console.error('Error creating asset:', error);
      throw new BadRequestException('Failed to create asset');
    }
  }

  /**
   * Create a new waypoint
   */
  async createWaypoint(waypointData: Partial<Waypoint>) {
    try {
      const waypoint = this.waypointsRepository.create(waypointData);
      return await this.waypointsRepository.save(waypoint);
    } catch (error) {
      console.error('Error creating waypoint:', error);
      throw new BadRequestException('Failed to create waypoint');
    }
  }

  /**
   * Create a new settlement
   */
  async createSettlement(settlementData: Partial<Settlement>) {
    try {
      const settlement = this.settlementsRepository.create(settlementData);
      return await this.settlementsRepository.save(settlement);
    } catch (error) {
      console.error('Error creating settlement:', error);
      throw new BadRequestException('Failed to create settlement');
    }
  }

  /**
   * Update asset status
   */
  async updateAssetStatus(assetId: number, status: string) {
    try {
      const asset = await this.assetsRepository.findOne({
        where: { asset_id: assetId }
      });
      
      if (!asset) {
        throw new NotFoundException('Asset not found');
      }
      
      asset.status = status;
      return await this.assetsRepository.save(asset);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating asset status:', error);
      throw new BadRequestException('Failed to update asset status');
    }
  }

  /**
   * Get assets by status
   */
  async getAssetsByStatus(status: string) {
    try {
      return await this.assetsRepository.find({
        where: { status },
        order: { license_plate: 'ASC' }
      });
    } catch (error) {
      console.error('Error fetching assets by status:', error);
      throw new BadRequestException('Failed to fetch assets by status');
    }
  }

  /**
   * Get settlements by status
   */
  async getSettlementsByStatus(status: string) {
    try {
      return await this.settlementsRepository.find({
        where: { status },
        order: { settlement_date: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching settlements by status:', error);
      throw new BadRequestException('Failed to fetch settlements by status');
    }
  }

  /**
   * Get daily statistics
   */
  async getDailyStats(date?: Date) {
    try {
      const targetDate = date || new Date();
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const [
        dailySettlements,
        dailyAmount
      ] = await Promise.all([
        this.settlementsRepository.count({
          where: {
            settlement_date: Between(startOfDay, endOfDay)
          }
        }),
        this.settlementsRepository
          .createQueryBuilder('settlement')
          .select('SUM(settlement.amount)', 'total')
          .where('settlement.settlement_date BETWEEN :start AND :end', {
            start: startOfDay,
            end: endOfDay
          })
          .getRawOne()
      ]);

      return {
        date: targetDate.toISOString().split('T')[0],
        settlements: dailySettlements,
        totalAmount: dailyAmount?.total || 0
      };
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      throw new BadRequestException('Failed to fetch daily statistics');
    }
  }
}