/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PerformerEntity } from '../performer/performer.entity';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumPerformerService } from './album-performer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import e from 'express';

describe('AlbumPerformerService', () => {
  let service: AlbumPerformerService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let album: AlbumEntity;
  let performersList : PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumPerformerService],
    }).compile();

    service = module.get<AlbumPerformerService>(AlbumPerformerService);
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    performerRepository.clear();
    albumRepository.clear();

    performersList = [];
    for(let i = 0; i < 5; i++){
        const performer: PerformerEntity = await performerRepository.save({
            name: faker.person.fullName(),
            pic: faker.image.url(), 
            description: faker.lorem.sentence()
        })
        performersList.push(performer);
    }

    album = await albumRepository.save({
        name: faker.lorem.sentence(), 
        cover: faker.image.url(), 
        releaseDate: faker.date.past(),
        description: faker.lorem.paragraph(2),
      performers: performersList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPerformerAlbum should add a performer to a album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
        name: faker.person.fullName(),
        pic: faker.image.url(), 
        description: faker.lorem.sentence()
    });

    const newAlbum: AlbumEntity = await albumRepository.save({
        name: faker.lorem.sentence(), 
        cover: faker.image.url(), 
        releaseDate: faker.date.past(),
        description: faker.lorem.paragraph(2)
    })

    const result: AlbumEntity = await service.addPerformerAlbum(newAlbum.id, newPerformer.id);
    
    expect(result.performers.length).toBe(1);
    expect(result.performers[0]).not.toBeNull();
    expect(result.performers[0].id).toEqual(newPerformer.id);
    expect(result.performers[0].name).toEqual(newPerformer.name);
    expect(result.performers[0].pic).toEqual(newPerformer.pic);
    expect(result.performers[0].description).toEqual(newPerformer.description);
    });

  it('addPerformerAlbum should thrown exception for an invalid performer', async () => {
    const newAlbum: AlbumEntity = await albumRepository.save({
        name: faker.lorem.sentence(), 
        cover: faker.image.url(), 
        releaseDate: faker.date.past(),
        description: faker.lorem.paragraph(2),
    })

    await expect(() => service.addPerformerAlbum(newAlbum.id, "0")).rejects.toHaveProperty("message", "The performer with the given id was not found");
  });

  it('addPerformerAlbum should throw an exception for an invalid album', async () => {
    const newPerformer: PerformerEntity = await performerRepository.save({
        name: faker.person.fullName(),
        pic: faker.image.url(), 
        description: faker.lorem.sentence()
    });

    await expect(() => service.addPerformerAlbum("0", newPerformer.id)).rejects.toHaveProperty("message", "The album with the given id was not found");
  });

});