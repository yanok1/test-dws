import { IsNumber } from 'class-validator';

export class ImportPokemonDto {
  @IsNumber()
  id: number;
}
