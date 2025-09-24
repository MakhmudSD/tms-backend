import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KoreanTmsController } from './korean-tms.controller';
import { KoreanTmsService } from './korean-tms.service';
import { Branch } from './branch.entity';
import { Client } from './client.entity';
import { Asset } from './asset.entity';
import { Waypoint } from './waypoint.entity';
import { Settlement } from './settlement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Client, Asset, Waypoint, Settlement]),
  ],
  controllers: [KoreanTmsController],
  providers: [KoreanTmsService],
  exports: [KoreanTmsService],
})
export class KoreanTmsModule {}