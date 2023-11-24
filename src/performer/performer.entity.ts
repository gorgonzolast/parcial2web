/* eslint-disable prettier/prettier */
import { AlbumEntity } from '../album/album.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PerformerEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    pic: string;

    @Column()
    description: string;

    @ManyToMany(() => AlbumEntity, album => album.performers)
    albums: AlbumEntity[];

}
