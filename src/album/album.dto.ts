/* eslint-disable prettier/prettier */

import {IsNotEmpty, IsString, IsUrl} from 'class-validator';

export class AlbumDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUrl()
    @IsNotEmpty()
    cover: string;

    @IsNotEmpty()
    releaseDate: Date;

    @IsString()
    @IsNotEmpty()
    description: string;
}
