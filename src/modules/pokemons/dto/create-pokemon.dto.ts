import { IsString, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  types: string[];
} 