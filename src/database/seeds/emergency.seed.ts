import { DataSource } from 'typeorm';
import { Emergency } from '../../modules/korean-tms/emergency.entity';
import { Asset } from '../../modules/korean-tms/asset.entity';
import { Driver } from '../../modules/drivers/driver.entity';

export async function seedEmergencies(dataSource: DataSource) {
  const emergencyRepository = dataSource.getRepository(Emergency);
  const assetRepository = dataSource.getRepository(Asset);
  const driverRepository = dataSource.getRepository(Driver);

  const assets = await assetRepository.find({ take: 5 });
  const drivers = await driverRepository.find({ take: 5 });

  const emergencyData = [
    {
      emergency_type: 'accident',
      priority: 'critical',
      status: 'reported',
      vehicle_plate: '서울 12가 3456',
      driver_name: '김운전',
      current_location: '서울특별시 강남구 테헤란로 123',
      description: '교통사고 발생, 차량 전면 손상, 운전자 경상',
      contact_phone: '010-1234-5678',
      asset_id: assets[0]?.asset_id || null,
      driver_id: drivers[0]?.id || null,
      reported_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      response_logs: [
        {
          id: 1,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          action: '신고 접수',
          details: '비상 상황 신고가 접수되었습니다.'
        }
      ]
    },
    {
      emergency_type: 'breakdown',
      priority: 'high',
      status: 'investigating',
      vehicle_plate: '부산 34나 5678',
      driver_name: '이기사',
      current_location: '부산광역시 해운대구 해운대로 456',
      description: '엔진 오버히팅으로 차량 정지, 긴급 정비 필요',
      contact_phone: '010-2345-6789',
      asset_id: assets[1]?.asset_id || null,
      driver_id: drivers[1]?.id || null,
      reported_at: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      response_started_at: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      response_logs: [
        {
          id: 1,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          action: '신고 접수',
          details: '차량 고장 신고가 접수되었습니다.'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          action: '조사 시작',
          details: '상황 조사가 시작되었습니다.'
        }
      ]
    },
    {
      emergency_type: 'weather',
      priority: 'medium',
      status: 'responding',
      vehicle_plate: '대구 56다 9012',
      driver_name: '박운전',
      current_location: '대구광역시 수성구 동대구로 789',
      description: '폭설로 인한 도로 통제, 대체 경로 필요',
      contact_phone: '010-3456-7890',
      asset_id: assets[2]?.asset_id || null,
      driver_id: drivers[2]?.id || null,
      reported_at: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      response_started_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // 2.5 hours ago
      response_logs: [
        {
          id: 1,
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          action: '신고 접수',
          details: '기상악화 신고가 접수되었습니다.'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
          action: '대응 시작',
          details: '긴급 대응이 시작되었습니다.'
        }
      ]
    },
    {
      emergency_type: 'theft',
      priority: 'critical',
      status: 'investigating',
      vehicle_plate: '인천 78라 3456',
      driver_name: '최기사',
      current_location: '인천광역시 연수구 컨벤시아대로 321',
      description: '차량 도난 신고, GPS 추적 중',
      contact_phone: '010-4567-8901',
      asset_id: assets[3]?.asset_id || null,
      driver_id: drivers[3]?.id || null,
      reported_at: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      response_started_at: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      response_logs: [
        {
          id: 1,
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          action: '신고 접수',
          details: '차량 도난 신고가 접수되었습니다.'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          action: '조사 시작',
          details: '상황 조사가 시작되었습니다.'
        }
      ]
    },
    {
      emergency_type: 'traffic',
      priority: 'low',
      status: 'resolved',
      vehicle_plate: '광주 90마 7890',
      driver_name: '정운전',
      current_location: '광주광역시 서구 상무대로 654',
      description: '교통체증으로 인한 지연, 경로 변경 완료',
      contact_phone: '010-5678-9012',
      asset_id: assets[4]?.asset_id || null,
      driver_id: drivers[4]?.id || null,
      reported_at: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      response_started_at: new Date(Date.now() - 5.5 * 60 * 60 * 1000), // 5.5 hours ago
      resolved_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      response_time_minutes: 90, // 1.5 hours
      response_logs: [
        {
          id: 1,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          action: '신고 접수',
          details: '교통체증 신고가 접수되었습니다.'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(),
          action: '대응 시작',
          details: '긴급 대응이 시작되었습니다.'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          action: '해결 완료',
          details: '비상 상황이 해결되었습니다.'
        }
      ]
    }
  ];

  await emergencyRepository.clear();

  for (const emergency of emergencyData) {
    const emergencyEntity = emergencyRepository.create(emergency);
    await emergencyRepository.save(emergencyEntity);
  }

  console.log(`✅ Seeded ${emergencyData.length} emergency records`);
}
