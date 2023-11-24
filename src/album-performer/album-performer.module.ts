import { Module } from '@nestjs/common';
import { AlbumPerformerService } from './album-performer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity';
import { PerformerEntity } from '../performer/performer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity, PerformerEntity])],
  providers: [AlbumPerformerService]
})
export class AlbumPerformerModule {}
