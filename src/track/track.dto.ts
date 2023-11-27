/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class TrackDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    duration: number;

    @IsString()
    @IsNotEmpty()
    albumId: string;
}
