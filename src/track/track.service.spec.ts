/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TrackEntity } from './track.entity';
import { TrackService } from './track.service';

import { faker } from '@faker-js/faker';
import { AlbumEntity } from '../album/album.entity';

describe('TrackService', () => {
  let service: TrackService;
  let trackRepository: Repository<TrackEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let tracksList: TrackEntity[];
  let album: AlbumEntity;

  const seedDatabase = async () => {
    trackRepository.clear();
    albumRepository.clear();

    album = await albumRepository.save({
        name: faker.lorem.sentence(), 
        cover: faker.image.url(), 
        releaseDate: faker.date.past(),
        description: faker.lorem.paragraph(2)
    });

    tracksList = [];
    for (let i = 0; i < 5; i++) {
      const track: TrackEntity = await trackRepository.save({
        name: faker.company.buzzNoun(),
        duration: faker.number.int(),
        album: album,
      });
      tracksList.push(track);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    trackRepository = module.get<Repository<TrackEntity>>(
      getRepositoryToken(TrackEntity),
    );
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tracks', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks).toHaveLength(tracksList.length);
  });

  it('findOne should return a track by id', async () => {
    const storedTrack: TrackEntity = tracksList[0];
    const track: TrackEntity = await service.findOne(
      storedTrack.id,
    );
    expect(track).not.toBeNull();
    expect(track.name).toEqual(storedTrack.name);
    expect(track.duration).toEqual(storedTrack.duration);
    expect(track.album).toEqual(storedTrack.album);
  });

  it('findOne should throw an exception for an invalid track', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The track with the given id was not found',
    );
  });

  it('create should return a new track', async () => {
    const track: TrackEntity = {
      id: '',
      name: faker.company.buzzNoun(),
      duration: faker.number.int(),
      album: album,
    };

    const newTrack: TrackEntity = await service.create(
      track,
      album.id,
    );
    expect(newTrack).not.toBeNull();

    const storedTrack: TrackEntity =
      await trackRepository.findOne({
        where: { id: newTrack.id },
        relations: ['album'],
      });
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.name).toEqual(newTrack.name);
    expect(storedTrack.duration).toEqual(newTrack.duration);
    expect(storedTrack.album).toEqual(newTrack.album);
  });

  it('invalid create should throw an exception', async () => {
    const track: TrackEntity = {
      id: '',
      name: faker.company.buzzNoun(),
      duration: faker.number.int(),
      album: null,
    };
    await expect(() => service.create(track, '0')).rejects.toHaveProperty(
      'message',
      'The album with the given id was not found',
    );
  });

});