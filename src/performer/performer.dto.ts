/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PerformerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUrl()
    @IsNotEmpty()
    pic: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
