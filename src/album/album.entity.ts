/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TrackEntity } from '../track/track.entity';
import { PerformerEntity } from '../performer/performer.entity';

@Entity()
export class AlbumEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    cover: string;

    @Column()
    releaseDate: Date;

    @Column()
    description: string;

    @OneToMany(() => TrackEntity, track => track.album)
    tracks: TrackEntity[];

    @ManyToMany(() => PerformerEntity, performer => performer.albums)
    @JoinTable()
    performers: PerformerEntity[];

}
