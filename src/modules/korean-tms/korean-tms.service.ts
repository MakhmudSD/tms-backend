import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Branch } from './branch.entity';
import { Client } from './client.entity';
import { Asset } from './asset.entity';
import { Waypoint } from './waypoint.entity';
import { Settlement } from './settlement.entity';
import { Emergency } from './emergency.entity';
import { CreateEmergencyDto } from './dto/create-emergency.dto';
import { UpdateEmergencyDto } from './dto/update-emergency.dto';

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
    @InjectRepository(Emergency)
    private emergenciesRepository: Repository<Emergency>,
  ) {}

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
          .select('SUM(settlement.total_amount)', 'total')
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
        totalAmount:         totalAmount?.total || 0,
        orders: totalSettlements,
        pendingOrders: pendingSettlements,
        inTransitOrders: assignedAssets,
        completedOrders: completedSettlements,
        emergencyOrders: await this.emergenciesRepository.count({ where: { status: 'reported' } })
      };
    } catch (error) {
      console.error('Error fetching Korean TMS stats:', error);
      throw new BadRequestException('Failed to fetch statistics');
    }
  }

  async getAllBranches() {
    try {
      const branches = await this.branchesRepository.find({
        order: { branch_name: 'ASC' }
      });
      
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

  async getAllClients() {
    try {
      const clients = await this.clientsRepository.find({
        order: { client_name: 'ASC' }
      });
      
      const clientsWithStats = await Promise.all(
        clients.map(async (client) => {
          const settlementCount = await this.settlementsRepository.count({
            where: { client_id: client.client_id }
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

  async getAllAssets() {
    try {
      const assets = await this.assetsRepository.find({
        order: { license_plate: 'ASC' }
      });
      
      const assetsWithOrders = await Promise.all(
        assets.map(async (asset) => {
          const activeSettlement = await this.settlementsRepository.findOne({
            where: { 
              settlement_id: asset.asset_id,
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

  async getAllWaypoints() {
    try {
      return await this.waypointsRepository.find({
        order: { waypoint_name: 'ASC' }
      });
    } catch (error) {
      console.error('Error fetching waypoints:', error);
      throw new BadRequestException('Failed to fetch waypoints');
    }
  }

  async getAllSettlements() {
    try {
      return await this.settlementsRepository.find({
        order: { settlement_date: 'DESC' }
      });
    } catch (error) {
      console.error('Error fetching settlements:', error);
      throw new BadRequestException('Failed to fetch settlements');
    }
  }

  async createBranch(branchData: Partial<Branch>) {
    try {
      const branch = this.branchesRepository.create(branchData);
      return await this.branchesRepository.save(branch);
    } catch (error) {
      console.error('Error creating branch:', error);
      throw new BadRequestException('Failed to create branch');
    }
  }

  async createClient(clientData: Partial<Client>) {
    try {
      const client = this.clientsRepository.create(clientData);
      return await this.clientsRepository.save(client);
    } catch (error) {
      console.error('Error creating client:', error);
      throw new BadRequestException('Failed to create client');
    }
  }

  async createAsset(assetData: Partial<Asset>) {
    try {
      const asset = this.assetsRepository.create(assetData);
      return await this.assetsRepository.save(asset);
    } catch (error) {
      console.error('Error creating asset:', error);
      throw new BadRequestException('Failed to create asset');
    }
  }

  async createWaypoint(waypointData: Partial<Waypoint>) {
    try {
      const waypoint = this.waypointsRepository.create(waypointData);
      return await this.waypointsRepository.save(waypoint);
    } catch (error) {
      console.error('Error creating waypoint:', error);
      throw new BadRequestException('Failed to create waypoint');
    }
  }

  async createSettlement(settlementData: Partial<Settlement>) {
    try {
      const settlement = this.settlementsRepository.create(settlementData);
      return await this.settlementsRepository.save(settlement);
    } catch (error) {
      console.error('Error creating settlement:', error);
      throw new BadRequestException('Failed to create settlement');
    }
  }

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
          .select('SUM(settlement.total_amount)', 'total')
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

  // Emergency Management Methods
  async getAllEmergencies() {
    try {
      return await this.emergenciesRepository.find({
        order: { reported_at: 'DESC' },
        relations: ['asset', 'driver']
      });
    } catch (error) {
      console.error('Error fetching emergencies:', error);
      throw new BadRequestException('Failed to fetch emergencies');
    }
  }

  async getEmergencyById(id: number) {
    try {
      const emergency = await this.emergenciesRepository.findOne({
        where: { emergency_id: id },
        relations: ['asset', 'driver']
      });
      
      if (!emergency) {
        throw new NotFoundException('Emergency not found');
      }
      
      return emergency;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching emergency:', error);
      throw new BadRequestException('Failed to fetch emergency');
    }
  }

  async createEmergency(emergencyData: CreateEmergencyDto) {
    try {
      const emergency = this.emergenciesRepository.create({
        ...emergencyData,
        priority: emergencyData.priority || 'medium',
        status: 'reported',
        reported_at: new Date(),
        response_logs: [{
          id: 1,
          timestamp: new Date().toISOString(),
          action: '신고 접수',
          details: '비상 상황 신고가 접수되었습니다.'
        }]
      });
      
      return await this.emergenciesRepository.save(emergency);
    } catch (error) {
      console.error('Error creating emergency:', error);
      throw new BadRequestException('Failed to create emergency');
    }
  }

  async updateEmergency(id: number, updateData: UpdateEmergencyDto) {
    try {
      const emergency = await this.emergenciesRepository.findOne({
        where: { emergency_id: id }
      });
      
      if (!emergency) {
        throw new NotFoundException('Emergency not found');
      }

      // Handle status transitions and logging
      if (updateData.status && updateData.status !== emergency.status) {
        const timestamp = new Date().toISOString();
        const newLog = {
          id: (emergency.response_logs?.length || 0) + 1,
          timestamp,
          action: this.getStatusActionText(updateData.status),
          details: this.getStatusDetailsText(updateData.status)
        };

        updateData.response_logs = [
          ...(emergency.response_logs || []),
          newLog
        ];

        // Set timestamps based on status
        if (updateData.status === 'investigating' || updateData.status === 'responding') {
          updateData.response_started_at = new Date();
        } else if (updateData.status === 'resolved') {
          updateData.resolved_at = new Date();
          if (emergency.response_started_at) {
            const startTime = new Date(emergency.response_started_at);
            const endTime = new Date();
            updateData.response_time_minutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
          }
        }
      }

      Object.assign(emergency, updateData);
      return await this.emergenciesRepository.save(emergency);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating emergency:', error);
      throw new BadRequestException('Failed to update emergency');
    }
  }

  async deleteEmergency(id: number) {
    try {
      const emergency = await this.emergenciesRepository.findOne({
        where: { emergency_id: id }
      });
      
      if (!emergency) {
        throw new NotFoundException('Emergency not found');
      }

      await this.emergenciesRepository.remove(emergency);
      return { message: 'Emergency deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error deleting emergency:', error);
      throw new BadRequestException('Failed to delete emergency');
    }
  }

  async getEmergenciesByStatus(status: string) {
    try {
      return await this.emergenciesRepository.find({
        where: { status },
        order: { reported_at: 'DESC' },
        relations: ['asset', 'driver']
      });
    } catch (error) {
      console.error('Error fetching emergencies by status:', error);
      throw new BadRequestException('Failed to fetch emergencies by status');
    }
  }

  async getEmergencyStats() {
    try {
      const [
        totalEmergencies,
        activeEmergencies,
        resolvedToday,
        avgResponseTime
      ] = await Promise.all([
        this.emergenciesRepository.count(),
        this.emergenciesRepository.count({ where: { status: 'reported' } }),
        this.emergenciesRepository.count({
          where: {
            status: 'resolved',
            resolved_at: Between(
              new Date(new Date().setHours(0, 0, 0, 0)),
              new Date(new Date().setHours(23, 59, 59, 999))
            )
          }
        }),
        this.emergenciesRepository
          .createQueryBuilder('emergency')
          .select('AVG(emergency.response_time_minutes)', 'avg')
          .where('emergency.response_time_minutes IS NOT NULL')
          .getRawOne()
      ]);

      return {
        totalEmergencies,
        activeEmergencies,
        resolvedToday,
        avgResponseTime: Math.round(avgResponseTime?.avg || 0)
      };
    } catch (error) {
      console.error('Error fetching emergency stats:', error);
      throw new BadRequestException('Failed to fetch emergency statistics');
    }
  }

  private getStatusActionText(status: string): string {
    const statusMap: Record<string, string> = {
      'reported': '신고 접수',
      'investigating': '조사 시작',
      'responding': '대응 시작',
      'resolved': '해결 완료'
    };
    return statusMap[status] || status;
  }

  private getStatusDetailsText(status: string): string {
    const detailsMap: Record<string, string> = {
      'reported': '비상 상황 신고가 접수되었습니다.',
      'investigating': '상황 조사가 시작되었습니다.',
      'responding': '긴급 대응이 시작되었습니다.',
      'resolved': '비상 상황이 해결되었습니다.'
    };
    return detailsMap[status] || '상태가 업데이트되었습니다.';
  }

}