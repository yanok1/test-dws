import { IsOptional, IsString, IsArray, ArrayUnique } from 'class-validator';

export class UpdatePokemonDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  types?: string[];
} 