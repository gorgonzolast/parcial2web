/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PerformerEntity } from '../performer/performer.entity';
import { AlbumEntity } from '../album/album.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class AlbumPerformerService {
   constructor(
       @InjectRepository(AlbumEntity)
       private readonly albumRepository: Repository<AlbumEntity>,
   
       @InjectRepository(PerformerEntity)
       private readonly performerRepository: Repository<PerformerEntity>
   ) {}

   async addPerformerAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
       const performer: PerformerEntity = await this.performerRepository.findOne({where: {id: performerId}});
       if (!performer)
         throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND);
     
       const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["performers", "tracks"]})
       if (!album)
         throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);

        if (album.performers.find(p => p.id === performerId))
            throw new BusinessLogicException("The performer is already associated to the album", BusinessError.PRECONDITION_FAILED);
        if (album.performers.length >= 3)
            throw new BusinessLogicException("The album cannot have more than 3 performers associated", BusinessError.PRECONDITION_FAILED); 

   
       album.performers = [...album.performers, performer];
       return await this.albumRepository.save(album);
     }
   
}