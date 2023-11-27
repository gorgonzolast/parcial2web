import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from './track.entity';
import { TrackController } from './track.controller';

@Module({
  providers: [TrackService],
  imports: [TypeOrmModule.forFeature([TrackEntity])],
  controllers: [TrackController],
})
export class TrackModule {}
